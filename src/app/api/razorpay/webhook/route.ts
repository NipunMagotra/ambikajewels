import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

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

    // 3. Persistent Database Deduplication (Replay Protection Across Serverless Lambdas)
    if (dbClient && eventId) {
      try {
        const { error: dedupeErr } = await dbClient.from('webhook_events').insert({
          id: eventId,
          source: 'razorpay',
          event_type: eventType,
          payload: { event: eventType, account_id: event.account_id }
        });

        // Postgres 23505 = unique_violation
        if (dedupeErr && dedupeErr.code === '23505') {
          console.log(`[WEBHOOK IDEMPOTENT] Event ${eventId} was already recorded in database.`);
          return NextResponse.json({ success: true, idempotent: true, message: 'Event already processed' });
        }
      } catch (dbDedupeErr) {
        console.warn('[WEBHOOK PERSISTENT DEDUPE EXCEPTION]', dbDedupeErr);
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
          // Idempotent: already marked as paid
          if (existing.status === 'paid') {
            console.log(`[WEBHOOK IDEMPOTENT] Order ${existing.id} already marked as paid.`);
            return NextResponse.json({ success: true, idempotent: true });
          }

          // Strict Amount Verification Against Stored Order Total
          if (typeof paidAmountPaise === 'number' && existing.total) {
            if (paidAmountPaise !== existing.total) {
              console.error(
                `[SECURITY ALERT] Payment amount mismatch on order ${existing.id}! Razorpay paid: ${paidAmountPaise}, Stored total: ${existing.total}`
              );
              await dbClient
                .from('orders')
                .update({
                  notes: `SECURITY ALERT: Payment amount mismatch! Received: ${paidAmountPaise} paise, Expected: ${existing.total} paise. Investigate before dispatch.`,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

              return NextResponse.json(
                { success: false, error: 'Payment amount does not match stored order total' },
                { status: 400 }
              );
            }
          }

          const { error: updateErr } = await dbClient
            .from('orders')
            .update({
              status: 'paid',
              payment_id: paymentId,
              razorpay_payment_id: paymentId,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateErr) {
            console.error('[WEBHOOK DB UPDATE ERROR]', updateErr);
            // Return 500 so Razorpay retries
            return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500 });
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
