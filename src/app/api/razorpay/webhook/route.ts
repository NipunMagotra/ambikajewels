import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

// In-memory set for fast webhook event deduplication
const processedWebhookEventIds = new Set<string>();

function cleanupWebhookEvents() {
  if (processedWebhookEventIds.size > 2000) {
    processedWebhookEventIds.clear();
  }
}

export async function POST(request: Request) {
  try {
    cleanupWebhookEvents();

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
    const eventId = event.id;
    const eventType = event.event;
    const payload = event.payload;

    // 3. Idempotency Check on Event ID
    if (eventId && processedWebhookEventIds.has(eventId)) {
      console.log(`[WEBHOOK IDEMPOTENT] Event ${eventId} already processed.`);
      return NextResponse.json({ success: true, idempotent: true, message: 'Event already processed' });
    }
    if (eventId) {
      processedWebhookEventIds.add(eventId);
    }

    console.log(`[RAZORPAY WEBHOOK VERIFIED] Event: ${eventType} ID: ${eventId}`);

    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    // 4. Handle specific Razorpay events idempotently
    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payment?.entity;
        const paymentId = payment?.id;
        const razorpayOrderId = payment?.order_id;

        console.log(`[WEBHOOK] Payment Captured: ${paymentId} for Order: ${razorpayOrderId}`);

        if (dbClient && paymentId) {
          try {
            // Check if order already recorded as paid
            const { data: existing } = await dbClient
              .from('orders')
              .select('id, status, shiprocket_status, razorpay_payment_id')
              .or(`payment_id.eq.${paymentId},razorpay_payment_id.eq.${paymentId}`)
              .maybeSingle();

            if (existing && existing.status === 'paid') {
              console.log(`[WEBHOOK IDEMPOTENT] Order ${existing.id} already marked as paid.`);
              return NextResponse.json({ success: true, idempotent: true });
            }

            if (existing) {
              await dbClient
                .from('orders')
                .update({
                  status: 'paid',
                  payment_id: paymentId,
                  razorpay_payment_id: paymentId,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);
            }
          } catch (dbErr) {
            console.error('Error updating order on payment.captured:', dbErr);
          }
        }
        break;
      }

      case 'order.paid': {
        const order = payload.order?.entity;
        console.log(`[WEBHOOK] Order Paid: ${order?.id}`);
        break;
      }

      case 'payment.failed': {
        const payment = payload.payment?.entity;
        console.warn(`[WEBHOOK] Payment Failed: ${payment?.id} Reason: ${payment?.error_description}`);
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Razorpay Webhook Handler Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
