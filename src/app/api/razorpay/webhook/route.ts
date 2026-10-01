import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Razorpay Webhook Receiver
 *
 * Exact Order of Operations:
 * 1. Cryptographic HMAC-SHA256 signature verification on untampered RAW body buffer.
 * 2. Idempotency check: Query `webhook_events` for existing 'completed' event.
 * 3. Locate order in database via `razorpay_order_id` (or fallback `razorpay_payment_id`).
 * 4. Amount Verification:
 *    - If mismatch detected: return HTTP 200, record 'amount_mismatch' in `webhook_events`, flag order for review, log alert.
 * 5. Order Transition: Update database order to 'paid'.
 * 6. DB Failure Guard: If order update fails, DO NOT mark event as completed; return HTTP 500 so Razorpay retries.
 * 7. Mark Event Completed: Only after order update succeeds, record event as 'completed' in `webhook_events` (zero PII stored).
 */
export async function POST(request: Request) {
  try {
    // 1. Capture Raw Body and Signature for Cryptographic Verification
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
      console.warn('[SECURITY WARNING] Webhook received without x-razorpay-signature header.');
      return NextResponse.json(
        { success: false, error: 'Missing x-razorpay-signature header.' },
        { status: 400 }
      );
    }

    // 2. Cryptographic Signature Verification on Untouched Raw Body
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      console.error('[SECURITY ALERT] Razorpay Webhook Signature Verification Failed! Potential spoofing attempt.');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature.' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventId = String(event.id || '');
    const eventType = String(event.event || '');
    const payload = event.payload || {};

    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    // 3. Persistent Database Deduplication Check (Only skip if event was already COMPLETED)
    if (dbClient && eventId) {
      try {
        const { data: existingEvent } = await dbClient
          .from('webhook_events')
          .select('id, status')
          .eq('id', eventId)
          .maybeSingle();

        if (existingEvent && existingEvent.status === 'completed') {
          console.log(`[WEBHOOK IDEMPOTENT] Event ${eventId} was previously successfully completed.`);
          return NextResponse.json({ success: true, idempotent: true, message: 'Event already processed' });
        }
      } catch (dbDedupeErr) {
        console.warn('[WEBHOOK PERSISTENT DEDUPE QUERY EXCEPTION]', dbDedupeErr);
      }
    }

    console.log(`[RAZORPAY WEBHOOK VERIFIED] Event: ${eventType} ID: ${eventId}`);

    // 4. Handle Payment Capture & Order Paid Events
    if (eventType === 'payment.captured') {
      const payment = payload.payment?.entity;
      const paymentId = payment?.id;
      const razorpayOrderId = payment?.order_id;
      const paidAmountPaise = payment?.amount; // in paise

      console.log(`[WEBHOOK] Payment Captured: ${paymentId} for Order: ${razorpayOrderId} Amount: ${paidAmountPaise}`);

      if (dbClient && (razorpayOrderId || paymentId)) {
        // Look up by razorpay_order_id first (primary relation), or razorpay_payment_id
        let query = dbClient
          .from('orders')
          .select('id, order_number, total, status, razorpay_order_id, razorpay_payment_id');

        if (razorpayOrderId) {
          query = query.eq('razorpay_order_id', razorpayOrderId);
        } else if (paymentId) {
          query = query.eq('razorpay_payment_id', paymentId);
        }

        const { data: existing, error: queryErr } = await query.maybeSingle();

        if (queryErr) {
          console.error('[WEBHOOK DB QUERY ERROR]', queryErr);
          // Return 500 so Razorpay retries
          return NextResponse.json({ success: false, error: 'Database lookup failed' }, { status: 500 });
        }

        if (existing) {
          // Idempotent: order already marked as paid
          if (existing.status === 'paid') {
            console.log(`[WEBHOOK IDEMPOTENT] Order ${existing.id} already marked as paid.`);
            if (eventId) {
              await dbClient.from('webhook_events').upsert({
                id: eventId,
                source: 'razorpay',
                event_type: eventType,
                status: 'completed',
                processed_at: new Date().toISOString()
              });
            }
            return NextResponse.json({ success: true, idempotent: true });
          }

          // Strict Amount Verification Against Stored Order Total
          if (typeof paidAmountPaise === 'number' && existing.total) {
            if (paidAmountPaise !== existing.total) {
              console.error(
                `[SECURITY ALERT - MANUAL REVIEW REQUIRED] Webhook payment amount mismatch on order ${existing.id}! Razorpay paid: ${paidAmountPaise} paise (₹${paidAmountPaise / 100}), Stored total: ${existing.total} paise (₹${existing.total / 100})`
              );

              // Flag order in database for manual review
              await dbClient
                .from('orders')
                .update({
                  status: 'flagged_mismatch',
                  notes: `[SECURITY AUDIT REQUIRED] Payment amount mismatch: Received ₹${paidAmountPaise / 100} (${paidAmountPaise} paise), Expected ₹${existing.total / 100} (${existing.total} paise). DO NOT DISPATCH. Confirm with customer and CA before proceeding.`,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

              // Store flagged record in webhook_events (minimal non-PII record)
              if (eventId) {
                await dbClient.from('webhook_events').upsert({
                  id: eventId,
                  source: 'razorpay',
                  event_type: eventType,
                  status: 'amount_mismatch',
                  processed_at: new Date().toISOString()
                });
              }

              // Return HTTP 200 so Razorpay does not retry endlessly, but alert is stored and order is blocked from dispatch
              return NextResponse.json(
                { success: true, warning: 'Payment amount mismatch flagged for manual review' },
                { status: 200 }
              );
            }
          }

          // 5. Update Order to 'paid' in Database
          const { error: updateErr } = await dbClient
            .from('orders')
            .update({
              status: 'paid',
              payment_id: paymentId,
              razorpay_payment_id: paymentId,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          // 6. DB Failure Guard: If update fails, DO NOT mark event completed; return HTTP 500
          if (updateErr) {
            console.error('[WEBHOOK DB UPDATE ERROR] Order update failed:', updateErr);
            return NextResponse.json(
              { success: false, error: 'Database update failed. Requesting retry.' },
              { status: 500 }
            );
          }

          // 7. Mark Event Completed: Only after order update succeeds
          // Minimal fields only: NO customer email, phone, address, or payment card details!
          if (eventId) {
            await dbClient.from('webhook_events').upsert({
              id: eventId,
              source: 'razorpay',
              event_type: eventType,
              status: 'completed',
              processed_at: new Date().toISOString()
            });
          }

          console.log(`[WEBHOOK SUCCESS] Order ${existing.order_number || existing.id} marked as paid.`);
        } else {
          console.warn(`[WEBHOOK WARN] No database order located for Razorpay order ID ${razorpayOrderId}`);
        }
      }
    } else if (eventType === 'payment.failed') {
      const payment = payload.payment?.entity;
      console.warn(`[WEBHOOK] Payment Failed: ${payment?.id} Reason: ${payment?.error_description}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Webhook processing failed';
    console.error('Razorpay Webhook Handler Error:', error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
