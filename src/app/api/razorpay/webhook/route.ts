import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { secureLogger } from '@/lib/logger';

/**
 * Razorpay Webhook Receiver — UPI & Network Drop-Off Safety Net
 *
 * This endpoint catches payments that succeed on Razorpay's side but whose
 * frontend verify callback never fires (customer closed browser, lost network
 * after UPI approval, etc.). The create-order route pre-inserts a pending
 * order with razorpay_order_id, so this webhook can find and confirm it.
 *
 * Order of Operations:
 * 1. Raw body capture → HMAC-SHA256 signature verification (timing-safe).
 * 2. Persistent idempotency check via `webhook_events` table.
 * 3. Locate the pending order via `razorpay_order_id`.
 * 4. If order is already confirmed/paid → return 200 (idempotent, no-op).
 * 5. If order is still pending → amount verify → update to confirmed/paid.
 * 6. DB failure guard: return 500 so Razorpay retries. Mark event completed
 *    ONLY after order update succeeds.
 * 7. Audit log every recovered order via secureLogger.
 *
 * CRITICAL: Always return 200 for processed events so Razorpay stops retrying.
 *           Only return 500 for genuine transient failures (DB write errors).
 */
export async function POST(request: Request) {
  // Grab the DB client early — used throughout
  const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

  try {
    // ──────────────────────────────────────────────────────────────────────
    // 1. Raw Body Capture & Cryptographic Signature Verification
    // ──────────────────────────────────────────────────────────────────────
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[SECURITY FATAL] RAZORPAY_WEBHOOK_SECRET is not configured in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: Webhook secret not configured.' },
        { status: 500 }
      );
    }

    if (!signature) {
      secureLogger.warn('[WEBHOOK] Rejected: missing x-razorpay-signature header.');
      return NextResponse.json(
        { success: false, error: 'Missing x-razorpay-signature header.' },
        { status: 400 }
      );
    }

    // HMAC-SHA256 on the untouched raw body string — timing-safe comparison
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      secureLogger.error('[WEBHOOK] HMAC signature verification FAILED — potential spoofing attempt.');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature.' },
        { status: 400 }
      );
    }

    // ──────────────────────────────────────────────────────────────────────
    // 2. Parse the verified payload
    // ──────────────────────────────────────────────────────────────────────
    const event = JSON.parse(rawBody);
    const eventId = String(event.id || `rzp_wh_${Date.now()}`);
    const eventType = String(event.event || '');

    secureLogger.info(`[WEBHOOK VERIFIED] Event: ${eventType}, ID: ${eventId}`);

    // ──────────────────────────────────────────────────────────────────────
    // 3. Persistent Idempotency Check — skip if already completed
    // ──────────────────────────────────────────────────────────────────────
    if (dbClient && eventId) {
      try {
        const { data: existingEvent } = await dbClient
          .from('webhook_events')
          .select('id, status')
          .eq('id', eventId)
          .maybeSingle();

        if (existingEvent?.status === 'completed') {
          secureLogger.info(`[WEBHOOK IDEMPOTENT] Event ${eventId} already processed — returning 200.`);
          return NextResponse.json({ success: true, idempotent: true });
        }
      } catch (dedupeErr) {
        // Non-fatal: proceed without dedup guard
        secureLogger.warn(`[WEBHOOK] Dedupe lookup failed, proceeding: ${dedupeErr}`);
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 4. Route by Event Type — only process payment.captured & order.paid
    // ──────────────────────────────────────────────────────────────────────
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = eventType === 'payment.captured'
        ? event.payload?.payment?.entity
        : event.payload?.order?.entity?.payments?.items?.[0] ?? event.payload?.payment?.entity;

      // For order.paid, the order entity is at payload.order.entity
      const orderEntity = event.payload?.order?.entity;

      const paymentId: string = payment?.id || '';
      const razorpayOrderId: string = payment?.order_id || orderEntity?.id || '';
      const paidAmountPaise: number = payment?.amount ?? orderEntity?.amount_paid ?? 0;

      if (!razorpayOrderId && !paymentId) {
        secureLogger.warn(`[WEBHOOK] ${eventType} event has no razorpay_order_id or payment_id — cannot reconcile.`);
        // Return 200 so Razorpay doesn't retry a fundamentally unreconcilable event
        return NextResponse.json({ success: true, skipped: true, reason: 'No order/payment ID in payload' });
      }

      if (!dbClient) {
        secureLogger.warn('[WEBHOOK] Database client unavailable — cannot process payment event.');
        return NextResponse.json({ success: true, skipped: true, reason: 'Database not configured' });
      }

      // ────────────────────────────────────────────────────────────────────
      // 5. Look up the order by razorpay_order_id (primary) or payment_id
      // ────────────────────────────────────────────────────────────────────
      let orderQuery = dbClient
        .from('orders')
        .select('id, order_number, total, status, payment_status, razorpay_order_id, razorpay_payment_id');

      if (razorpayOrderId) {
        orderQuery = orderQuery.eq('razorpay_order_id', razorpayOrderId);
      } else {
        orderQuery = orderQuery.eq('razorpay_payment_id', paymentId);
      }

      const { data: existingOrder, error: queryErr } = await orderQuery.maybeSingle();

      if (queryErr) {
        secureLogger.error(`[WEBHOOK] Database order lookup failed: ${queryErr.message}`);
        // Return 500 so Razorpay retries — transient DB failure
        return NextResponse.json({ success: false, error: 'Database lookup failed' }, { status: 500 });
      }

      if (!existingOrder) {
        secureLogger.warn(
          `[WEBHOOK] No order found for razorpay_order_id=${razorpayOrderId}, payment_id=${paymentId}. ` +
          `This may be a payment for an order created before the pre-insert flow was deployed.`
        );
        // Return 200 — we can't process it, but retrying won't help
        await recordWebhookEvent(dbClient, eventId, eventType, 'orphaned');
        return NextResponse.json({ success: true, skipped: true, reason: 'No matching order in database' });
      }

      // ────────────────────────────────────────────────────────────────────
      // 6. Idempotency: If already confirmed & paid, no-op
      // ────────────────────────────────────────────────────────────────────
      if (existingOrder.payment_status === 'paid' || existingOrder.status === 'confirmed') {
        secureLogger.info(
          `[WEBHOOK IDEMPOTENT] Order ${existingOrder.order_number || existingOrder.id} already ` +
          `status=${existingOrder.status}, payment_status=${existingOrder.payment_status}. No update needed.`
        );
        await recordWebhookEvent(dbClient, eventId, eventType, 'completed');
        return NextResponse.json({ success: true, idempotent: true });
      }

      // ────────────────────────────────────────────────────────────────────
      // 7. Amount Verification — flag mismatches for manual review
      // ────────────────────────────────────────────────────────────────────
      if (typeof paidAmountPaise === 'number' && existingOrder.total && paidAmountPaise !== existingOrder.total) {
        secureLogger.error(
          `[WEBHOOK AMOUNT MISMATCH] Order ${existingOrder.order_number || existingOrder.id}: ` +
          `Razorpay=${paidAmountPaise} paise (₹${paidAmountPaise / 100}), ` +
          `DB=${existingOrder.total} paise (₹${existingOrder.total / 100}). ` +
          `Order flagged — DO NOT DISPATCH without CA/admin review.`
        );

        // Flag the order but do NOT mark it as confirmed
        await dbClient
          .from('orders')
          .update({
            notes: `[SECURITY AUDIT REQUIRED] Webhook amount mismatch: Received ₹${paidAmountPaise / 100}, Expected ₹${existingOrder.total / 100}. DO NOT DISPATCH.`,
            razorpay_payment_id: paymentId || existingOrder.razorpay_payment_id,
            payment_id: paymentId || existingOrder.razorpay_payment_id,
          })
          .eq('id', existingOrder.id);

        await recordWebhookEvent(dbClient, eventId, eventType, 'amount_mismatch');

        // Return 200 so Razorpay stops retrying — alert is stored, order is blocked
        return NextResponse.json({ success: true, warning: 'Amount mismatch flagged for review' });
      }

      // ────────────────────────────────────────────────────────────────────
      // 8. Recovery Update: pending_confirmation → confirmed, unpaid → paid
      // ────────────────────────────────────────────────────────────────────
      const { error: updateErr } = await dbClient
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'razorpay',
          payment_id: paymentId,
          razorpay_payment_id: paymentId,
        })
        .eq('id', existingOrder.id);

      // DB Failure Guard: If update fails, return 500 so Razorpay retries
      if (updateErr) {
        secureLogger.error(
          `[WEBHOOK DB UPDATE FAILED] Could not confirm order ${existingOrder.order_number || existingOrder.id}: ${updateErr.message}`
        );
        return NextResponse.json(
          { success: false, error: 'Database update failed. Requesting retry.' },
          { status: 500 }
        );
      }

      // ────────────────────────────────────────────────────────────────────
      // 9. Audit Log: Record that this webhook RECOVERED an abandoned payment
      // ────────────────────────────────────────────────────────────────────
      const wasRecovery = existingOrder.status === 'pending_confirmation' && existingOrder.payment_status === 'unpaid';

      if (wasRecovery) {
        secureLogger.info(
          `[WEBHOOK RECOVERY] 🔔 Abandoned payment recovered! ` +
          `Order ${existingOrder.order_number || existingOrder.id} was pending_confirmation/unpaid — ` +
          `now confirmed/paid via webhook ${eventType} (payment: ${paymentId}). ` +
          `Customer likely closed browser after UPI/payment approval.`
        );
      } else {
        secureLogger.info(
          `[WEBHOOK CONFIRMED] Order ${existingOrder.order_number || existingOrder.id} updated to confirmed/paid ` +
          `via webhook ${eventType} (payment: ${paymentId}).`
        );
      }

      // Mark event as completed ONLY after successful DB update
      await recordWebhookEvent(dbClient, eventId, eventType, 'completed');

      return NextResponse.json({ success: true, recovered: wasRecovery });

    } else if (eventType === 'payment.failed') {
      // ────────────────────────────────────────────────────────────────────
      // Handle payment failures — log but don't update order status
      // (customer might retry, or the order stays pending for admin review)
      // ────────────────────────────────────────────────────────────────────
      const payment = event.payload?.payment?.entity;
      secureLogger.warn(
        `[WEBHOOK] Payment failed: ${payment?.id || 'unknown'}, ` +
        `Reason: ${payment?.error_description || payment?.error_reason || 'Unknown'}, ` +
        `Order: ${payment?.order_id || 'unknown'}`
      );

      await recordWebhookEvent(dbClient, eventId, eventType, 'completed');
      return NextResponse.json({ success: true, event: 'payment.failed' });
    }

    // Unhandled event type — acknowledge to prevent retries
    secureLogger.info(`[WEBHOOK] Unhandled event type: ${eventType} — acknowledged.`);
    return NextResponse.json({ success: true, skipped: true, event: eventType });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Webhook processing failed';
    secureLogger.error(`[WEBHOOK EXCEPTION] ${errorMsg}`);
    // Return 500 for unexpected exceptions so Razorpay retries
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Helper: Record a webhook event in the persistent dedupe table
// Stores ZERO PII — only the Razorpay event ID, type, and processing status.
// ════════════════════════════════════════════════════════════════════════════
async function recordWebhookEvent(
  dbClient: typeof supabaseAdmin,
  eventId: string,
  eventType: string,
  status: string
): Promise<void> {
  if (!dbClient || !eventId) return;
  try {
    await dbClient.from('webhook_events').upsert({
      id: eventId,
      source: 'razorpay',
      event_type: eventType,
      status,
      processed_at: new Date().toISOString()
    });
  } catch (err) {
    // Non-fatal — the webhook processed the order successfully regardless
    secureLogger.warn(`[WEBHOOK] Failed to record event ${eventId} in webhook_events: ${err}`);
  }
}
