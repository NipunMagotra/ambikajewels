import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { mapBvcTrackingStatus, verifyBvcWebhookSignature } from '@/lib/bvcLogistics';

// In-memory set for deduplicating high-frequency BVC webhook events
const processedWebhookEventIds = new Set<string>();

function cleanupWebhookCache() {
  if (processedWebhookEventIds.size > 2000) {
    processedWebhookEventIds.clear();
  }
}

/**
 * Phase 4: BVC Logistics Inbound Tracking Webhook Receiver
 * 
 * Securely listens to real-time telemetry from BVC's armored transport and vault network:
 * - IN_TRANSIT (Armored carrier transit)
 * - SECURE_VAULTED (Strongroom deposit)
 * - OUT_FOR_SECURE_DELIVERY (Armed escort dispatch)
 * - DELIVERED_OTP (Secured customer OTP verification)
 */
export async function POST(request: Request) {
  try {
    cleanupWebhookCache();

    // 1. Capture Raw Body and Signature for Cryptographic Integrity
    const rawBody = await request.text();
    const signature = request.headers.get('x-bvc-signature') || request.headers.get('x-signature');
    const authHeader = request.headers.get('authorization');

    // Verify authentication secret (Mandatory: Reject if unconfigured)
    const webhookSecret = process.env.BVC_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[SECURITY FATAL] BVC_WEBHOOK_SECRET is not configured in server environment variables.');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: BVC webhook secret not configured.' },
        { status: 500 }
      );
    }

    const isValidSig = verifyBvcWebhookSignature(rawBody, signature);
    const isValidBearer = authHeader && authHeader.replace(/^Bearer\s+/i, '') === webhookSecret;

    if (!isValidSig && !isValidBearer) {
      console.warn('[BVC WEBHOOK SECURITY WARNING] Webhook signature / bearer token verification failed.');
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid BVC webhook signature or token.' },
        { status: 401 }
      );
    }

interface BvcWebhookInboundPayload {
  event_id?: string;
  id?: string;
  docket_number?: string;
  waybill_number?: string;
  awb?: string;
  order_reference_number?: string;
  order_id?: string;
  reference_id?: string;
  status_code?: string;
  status?: string;
  current_status?: string;
  location?: string;
  hub_city?: string;
  activity_location?: string;
  remarks?: string;
  activity?: string;
  comment?: string;
  timestamp?: string;
  [key: string]: unknown;
}

    // 2. Parse and Sanitize Inbound Payload
    let payload: BvcWebhookInboundPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload format.' },
        { status: 400 }
      );
    }

    const eventId = String(payload.event_id || payload.id || `${payload.docket_number}_${payload.status}_${Date.now()}`);
    
    // Webhook Idempotency Check
    if (processedWebhookEventIds.has(eventId)) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: 'Event previously processed.'
      });
    }
    processedWebhookEventIds.add(eventId);

    // Extract BVC tracking fields (supports multiple BVC Universe API schema variations)
    const docketNumber = String(payload.docket_number || payload.waybill_number || payload.awb || '').trim();
    const orderReference = String(payload.order_reference_number || payload.order_id || payload.reference_id || '').trim();
    const rawStatusCode = String(payload.status_code || payload.status || payload.current_status || '').trim();
    const location = String(payload.location || payload.hub_city || payload.activity_location || 'Transit Hub');
    const remarks = String(payload.remarks || payload.activity || payload.comment || '');
    const timestamp = payload.timestamp || new Date().toISOString();

    console.log(`[BVC TRACKING WEBHOOK] Docket: ${docketNumber} | Ref: ${orderReference} | Status: ${rawStatusCode}`);

    // 3. Map BVC Status to Internal Database Order Model
    const mapped = mapBvcTrackingStatus(rawStatusCode);

    // 4. Update Database Order Model in Supabase
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    if (dbClient && (orderReference || docketNumber)) {
      try {
        // Query order by reference number or BVC docket
        let query = dbClient.from('orders').select('id, order_number, status, bvc_status, notes');
        if (orderReference) {
          query = query.eq('order_number', orderReference);
        } else {
          query = query.or(`bvc_docket_number.eq.${docketNumber},shiprocket_order_id.eq.${docketNumber}`);
        }

        const { data: existingOrder, error: queryErr } = await query.maybeSingle();

        if (queryErr) {
          console.error('[BVC WEBHOOK DB QUERY ERROR]', queryErr);
        } else if (existingOrder) {
          const updatePayload: Record<string, unknown> = {
            bvc_status: rawStatusCode,
            shiprocket_status: rawStatusCode, // Backward-compatibility mirror
            updated_at: new Date().toISOString()
          };

          if (docketNumber) {
            updatePayload.bvc_docket_number = docketNumber;
            updatePayload.shiprocket_awb = docketNumber;
          }

          // Advance status only if not already cancelled or already completed
          if (existingOrder.status !== 'cancelled' && existingOrder.status !== 'delivered') {
            updatePayload.status = mapped.internalStatus;
          }

          // Log tracking note
          const statusNote = `\n[${timestamp}] BVC eSHIP: ${mapped.displayStatus} (${location}) - ${remarks}`;
          updatePayload.notes = existingOrder.notes ? `${existingOrder.notes}${statusNote}` : statusNote;

          await dbClient
            .from('orders')
            .update(updatePayload)
            .eq('id', existingOrder.id);

          console.log(`[BVC ORDER UPDATED] Order ${existingOrder.order_number} transitioned to: ${mapped.internalStatus} (${mapped.displayStatus})`);
        } else {
          console.warn(`[BVC WEBHOOK WARN] No order record located for Ref: ${orderReference} / Docket: ${docketNumber}`);
        }
      } catch (dbErr) {
        console.error('[BVC WEBHOOK DB PERSIST EXCEPTION]', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
      mapped_status: mapped.internalStatus,
      display_status: mapped.displayStatus,
      tracking_stage: mapped.trackingStage
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown webhook exception';
    console.error('[BVC WEBHOOK EXCEPTION]', error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * Health check & verification for BVC Webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Ambika Jewels BVC Logistics Secure Webhook Gateway',
    version: '2.0.0',
    protocol: 'BVC eSHIP Armored Transit Verification'
  });
}
