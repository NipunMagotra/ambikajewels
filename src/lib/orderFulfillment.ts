import Razorpay from 'razorpay';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { createBvcShipment } from '@/lib/bvcLogistics';
import { sendOrderConfirmationEmail, sendAdminBvcFailureAlert } from '@/lib/email';
import { confirmInventoryForOrder } from '@/lib/inventoryEngine';
import { generateSecureOrderNumber } from '@/lib/orderUtils';
import { generateOrderAccessToken } from '@/lib/encryption';
import { secureLogger } from '@/lib/logger';

export interface PostPaymentCustomerInfo {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pan_number?: string;
  notes?: string;
}

export interface PostPaymentFulfillmentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  customerInfo?: PostPaymentCustomerInfo;
  items?: Array<any>;
  totalAmountPaise?: number;
  source: 'verify' | 'webhook';
  supabaseOrderId?: string;
}

export interface FulfillmentResult {
  success: boolean;
  orderNumber: string;
  orderAccessToken?: string;
  paymentId: string;
  bvcStatus: string;
  bvcDocketNumber?: string | null;
  bvcShipmentId?: string | null;
  bvcSecurityBag?: string | null;
  bvcError?: string | null;
  idempotent?: boolean;
  alreadyClaimed?: boolean;
  oversold?: boolean;
  refundId?: string | null;
  refundStatus?: string;
  errorMessage?: string;
  order?: any;
}

// Fallback in-memory claim tracker for offline / dev mock environments where Supabase is not connected
const memoryClaimedOrders = new Set<string>();
const memoryFulfillmentResults = new Map<string, FulfillmentResult>();

/**
 * Parses city and state from shipping address string (e.g. "Address, City, State - Pincode")
 */
export function parseCityAndState(address?: string, pincode?: string): { city: string; state: string } {
  let city = 'Jammu';
  let state = 'Jammu & Kashmir';
  if (address) {
    const cleaned = address.replace(/-\s*\d{6}/, '').trim();
    const parts = cleaned.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      state = parts[parts.length - 1];
      city = parts[parts.length - 2];
    } else if (parts.length === 1) {
      city = parts[0];
    }
  }
  return { city, state };
}

/**
 * Authoritative, database-backed atomic payment fulfillment state machine.
 *
 * Guarantees:
 * 1. Exactly ONE execution claims post-payment side effects (BVC consignment, email, etc.)
 *    via PostgreSQL row-level locks on `orders.payment_status = 'unpaid'`.
 * 2. Concurrent webhook / frontend verify requests detect claimed state and return idempotently.
 * 3. Inspects confirmInventoryForOrder() result. If inventory reservation expired or was sold out:
 *    - Halts BVC shipment creation
 *    - Halts normal confirmation email
 *    - Transitions order to 'oversold_manual_review'
 *    - Idempotently executes safe Razorpay refund
 *    - Alerts showroom administrator
 * 4. Never creates duplicate BVC consignments, duplicate security bag seals, or duplicate refunds.
 */
export async function executePaymentFulfillment(
  params: PostPaymentFulfillmentParams
): Promise<FulfillmentResult> {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    customerInfo,
    items,
    totalAmountPaise,
    source,
    supabaseOrderId
  } = params;

  const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Locate Pending Order Record
  // ──────────────────────────────────────────────────────────────────────────
  let pendingOrder: any = null;

  if (dbClient) {
    try {
      if (razorpayOrderId) {
        const { data } = await dbClient
          .from('orders')
          .select('*')
          .eq('razorpay_order_id', razorpayOrderId)
          .maybeSingle();
        pendingOrder = data;
      }

      if (!pendingOrder && supabaseOrderId) {
        const { data } = await dbClient
          .from('orders')
          .select('*')
          .eq('id', supabaseOrderId)
          .maybeSingle();
        pendingOrder = data;
      }

      if (!pendingOrder && razorpayPaymentId) {
        const { data } = await dbClient
          .from('orders')
          .select('*')
          .or(`payment_id.eq.${razorpayPaymentId},razorpay_payment_id.eq.${razorpayPaymentId}`)
          .maybeSingle();
        pendingOrder = data;
      }

      if (!pendingOrder && razorpayOrderId) {
        const { data } = await dbClient
          .from('orders')
          .select('*')
          .eq('order_number', razorpayOrderId)
          .maybeSingle();
        pendingOrder = data;
      }
    } catch (lookupErr) {
      console.error('[FULFILLMENT DB LOOKUP ERROR]', lookupErr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Persistent Idempotency Check — Skip if already completed or oversold
  // ──────────────────────────────────────────────────────────────────────────
  if (pendingOrder) {
    const isAlreadyPaid = pendingOrder.payment_status === 'paid' || pendingOrder.status === 'confirmed';
    const isOversold = pendingOrder.status === 'oversold_manual_review' || pendingOrder.payment_status === 'refunded';
    const hasBvcShipment = Boolean(
      pendingOrder.bvc_docket_number ||
      pendingOrder.bvc_shipment_id ||
      pendingOrder.bvc_status === 'shipment_created' ||
      pendingOrder.bvc_status === 'created' ||
      pendingOrder.bvc_status === 'booked' ||
      pendingOrder.bvc_status === 'simulated'
    );
    const hasEmailSent = Boolean(pendingOrder.notes && pendingOrder.notes.includes('[CONFIRMATION_EMAIL_SENT]'));

    // A. Already fulfilled (paid, shipped, emailed)
    if (isAlreadyPaid && hasBvcShipment && hasEmailSent) {
      secureLogger.info(`[FULFILLMENT IDEMPOTENT] Order ${pendingOrder.order_number} already fully processed. Returning.`);
      const token = generateOrderAccessToken(
        pendingOrder.order_number || pendingOrder.id,
        pendingOrder.customer_email || pendingOrder.customer_phone || ''
      );
      return {
        success: true,
        idempotent: true,
        orderNumber: pendingOrder.order_number,
        orderAccessToken: token,
        paymentId: razorpayPaymentId,
        bvcStatus: pendingOrder.bvc_status,
        bvcDocketNumber: pendingOrder.bvc_docket_number,
        bvcShipmentId: pendingOrder.bvc_shipment_id,
        bvcSecurityBag: pendingOrder.bvc_security_bag_number,
        order: pendingOrder
      };
    }

    // B. Already handled as oversold
    if (isOversold) {
      secureLogger.warn(`[FULFILLMENT IDEMPOTENT] Order ${pendingOrder.order_number} already in oversold_manual_review state.`);
      return {
        success: false,
        oversold: true,
        idempotent: true,
        orderNumber: pendingOrder.order_number,
        paymentId: razorpayPaymentId,
        bvcStatus: pendingOrder.bvc_status || 'cancelled_oversold',
        errorMessage: 'Inventory was unavailable and order is in manual review / refunded.',
        order: pendingOrder
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Database-Backed Atomic Claim
  // ──────────────────────────────────────────────────────────────────────────
  // Only the first thread that atomically transitions payment_status from 'unpaid'
  // to 'paid' obtains the exclusive post-payment fulfillment claim.
  let hasClaim = false;
  let activeOrder = pendingOrder;

  if (dbClient && pendingOrder?.id) {
    try {
      const { data: claimedRow, error: claimErr } = await dbClient
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
          payment_id: razorpayPaymentId,
          razorpay_payment_id: razorpayPaymentId,
          bvc_status: 'shipment_pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', pendingOrder.id)
        .eq('payment_status', 'unpaid')
        .select('*')
        .maybeSingle();

      if (!claimErr && claimedRow) {
        hasClaim = true;
        activeOrder = claimedRow;
        secureLogger.info(`[FULFILLMENT CLAIM] ${source.toUpperCase()} successfully claimed order ${claimedRow.order_number} for processing.`);
      } else {
        // Did not match payment_status = 'unpaid'; another worker claimed or finished it.
        hasClaim = false;
        secureLogger.info(`[FULFILLMENT CONCURRENT] ${source.toUpperCase()} detected order ${pendingOrder.order_number} already claimed by another handler.`);
      }
    } catch (claimException) {
      console.error('[FULFILLMENT ATOMIC CLAIM EXCEPTION]', claimException);
    }
  } else {
    // Dev / mock fallback when Supabase is disconnected
    const key = razorpayPaymentId || razorpayOrderId || supabaseOrderId || 'mock_order';
    if (!memoryClaimedOrders.has(key)) {
      memoryClaimedOrders.add(key);
      hasClaim = true;
    } else {
      hasClaim = false;
    }
  }

  // If another concurrent request already holds the claim, return idempotent result without side effects
  if (!hasClaim) {
    const memoryKey = razorpayPaymentId || razorpayOrderId || supabaseOrderId || 'mock_order';
    if (!dbClient && memoryFulfillmentResults.has(memoryKey)) {
      const cached = memoryFulfillmentResults.get(memoryKey)!;
      return {
        ...cached,
        idempotent: true,
        alreadyClaimed: true
      };
    }

    if (dbClient && pendingOrder?.id) {
      // If claimed by another concurrent thread, poll briefly (up to 500ms) for that thread to finalize
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: refreshed } = await dbClient
          .from('orders')
          .select('*')
          .eq('id', pendingOrder.id)
          .maybeSingle();
        if (refreshed) {
          activeOrder = refreshed;
          if (
            refreshed.status === 'confirmed' ||
            refreshed.status === 'oversold_manual_review' ||
            (refreshed.bvc_status && refreshed.bvc_status !== 'shipment_pending')
          ) {
            break;
          }
        }
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    const orderNum = activeOrder?.order_number || pendingOrder?.order_number || razorpayOrderId;
    const token = generateOrderAccessToken(
      orderNum,
      activeOrder?.customer_email || activeOrder?.customer_phone || customerInfo?.email || customerInfo?.phone || ''
    );

    return {
      success: activeOrder?.status !== 'oversold_manual_review',
      idempotent: true,
      alreadyClaimed: true,
      oversold: activeOrder?.status === 'oversold_manual_review',
      orderNumber: orderNum,
      orderAccessToken: token,
      paymentId: razorpayPaymentId,
      bvcStatus: activeOrder?.bvc_status || 'shipment_pending',
      bvcDocketNumber: activeOrder?.bvc_docket_number,
      order: activeOrder
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Order Information Normalization
  // ──────────────────────────────────────────────────────────────────────────
  const orderNumber = activeOrder?.order_number ||
    (razorpayOrderId && razorpayOrderId.startsWith('AMB-') ? razorpayOrderId : generateSecureOrderNumber());
  const verifiedTotalPaise = typeof activeOrder?.total === 'number'
    ? activeOrder.total
    : (totalAmountPaise || 0);
  const verifiedSubtotalPaise = typeof activeOrder?.subtotal === 'number'
    ? activeOrder.subtotal
    : Math.round(verifiedTotalPaise * 100 / 103);
  const verifiedTaxPaise = typeof activeOrder?.tax === 'number'
    ? activeOrder.tax
    : (verifiedTotalPaise - verifiedSubtotalPaise);
  const verifiedItems = Array.isArray(activeOrder?.items) && activeOrder.items.length > 0
    ? activeOrder.items
    : (items || []);

  const customerName = (
    customerInfo?.first_name
      ? `${customerInfo.first_name} ${customerInfo.last_name || ''}`.trim()
      : activeOrder?.customer_name
  ) || 'Valued Patron';
  const customerEmail = customerInfo?.email || activeOrder?.customer_email || '';
  const customerPhone = customerInfo?.phone || activeOrder?.customer_phone || '';
  const shippingAddress = customerInfo?.address
    ? `${customerInfo.address}, ${customerInfo.city || ''}, ${customerInfo.state || ''} - ${customerInfo.pincode || ''}`
    : (activeOrder?.shipping_address || '');
  const pincode = customerInfo?.pincode || activeOrder?.pincode || '180013';

  // ──────────────────────────────────────────────────────────────────────────
  // 5. CRITICAL 3: Confirm Inventory & Anti-Double-Selling Defense
  // ──────────────────────────────────────────────────────────────────────────
  // If the reservation expired and the item was purchased or confirmed for another order,
  // confirmInventoryForOrder returns { success: false }.
  const inventoryResult = await confirmInventoryForOrder(orderNumber, verifiedItems);

  if (!inventoryResult.success) {
    secureLogger.error(
      `[OVERSOLD DEFENSE TRIGGERED] Order ${orderNumber} failed inventory confirmation: ${inventoryResult.error}. ` +
      `HALTING BVC shipment & normal email. Initiating safe refund.`
    );

    const alertNotes = (activeOrder?.notes ? activeOrder.notes + '\n' : '') +
      `[OVERSOLD_ALERT] Reservation expired or item sold out. Reason: ${inventoryResult.error || 'Unavailable'}. ` +
      `Payment ID: ${razorpayPaymentId}. Preserving payment record for audit. Safe auto-refund initiated.`;

    // Persist oversold state to database
    if (dbClient && activeOrder?.id) {
      try {
        await dbClient
          .from('orders')
          .update({
            status: 'oversold_manual_review',
            bvc_status: 'cancelled_oversold',
            notes: alertNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeOrder.id);
      } catch (dbOversoldErr) {
        console.error('[DB OVERSOLD UPDATE ERROR]', dbOversoldErr);
      }
    }

    // Idempotent Razorpay Refund
    let refundId: string | null = null;
    let refundStatus = 'manual_review_required';

    const isAlreadyRefunded = activeOrder?.payment_status === 'refunded' ||
      (typeof activeOrder?.notes === 'string' && activeOrder.notes.includes('[REFUND_COMPLETED:'));

    if (isAlreadyRefunded) {
      secureLogger.info(`[OVERSOLD REFUND IDEMPOTENT] Order ${orderNumber} was already refunded. Skipping duplicate refund.`);
      refundStatus = 'already_refunded';
    } else {
      const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      const isLiveProduction = process.env.NODE_ENV === 'production' && key_id && !key_id.includes('test') && !key_id.includes('mock');

      if (key_id && key_secret && isLiveProduction) {
        try {
          const razorpay = new Razorpay({ key_id, key_secret });
          const refundRes = await razorpay.payments.refund(razorpayPaymentId, {
            amount: verifiedTotalPaise,
            notes: {
              reason: 'oversold_reservation_expired',
              order_number: orderNumber,
              detail: inventoryResult.error || 'Inventory unavailable'
            },
            receipt: `ref_${orderNumber}`
          });
          refundId = refundRes.id;
          refundStatus = 'refunded';
          secureLogger.info(`[OVERSOLD REFUND SUCCESS] Refund ${refundId} completed for payment ${razorpayPaymentId}`);
        } catch (refErr: any) {
          console.error(`[OVERSOLD REFUND ERROR] Could not refund payment ${razorpayPaymentId}:`, refErr?.message || refErr);
        }
      } else {
        // Test / development simulation mode
        refundId = `rfnd_mock_${Date.now()}`;
        refundStatus = 'refunded';
        secureLogger.info(`[OVERSOLD REFUND SIMULATED] Simulated refund ${refundId} for order ${orderNumber}`);
      }
    }

    // If refund succeeded, record in orders table
    if (refundId && dbClient && activeOrder?.id) {
      try {
        await dbClient
          .from('orders')
          .update({
            payment_status: 'refunded',
            notes: alertNotes + `\n[REFUND_COMPLETED: ${refundId}] Auto-refund of ₹${verifiedTotalPaise / 100} initiated.`,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeOrder.id);
      } catch (refUpdateErr) {
        console.error('[REFUND UPDATE DB ERROR]', refUpdateErr);
      }
    }

    // Dispatch Admin Alert
    sendAdminBvcFailureAlert({
      orderNumber,
      razorpayPaymentId,
      razorpayOrderId: activeOrder?.razorpay_order_id || razorpayOrderId,
      customerName,
      customerEmail,
      customerPhone,
      amount: verifiedTotalPaise,
      items: verifiedItems,
      errorMessage: `[CRITICAL OVERSOLD ALERT] ${inventoryResult.error || 'Item unavailable'}. Order marked oversold_manual_review.${refundId ? ` Auto-refund ${refundId} initiated.` : ' Manual refund required.'}`
    }).catch((alertErr) => {
      console.error('[ADMIN OVERSOLD ALERT ERROR]', alertErr);
    });

    const oversoldResult: FulfillmentResult = {
      success: false,
      oversold: true,
      orderNumber,
      paymentId: razorpayPaymentId,
      bvcStatus: 'cancelled_oversold',
      refundId,
      refundStatus,
      errorMessage: 'We apologize, but this handcrafted jewellery piece was reserved or sold just before payment completed. Your payment has been preserved and a full automatic refund has been initiated to your original payment method. Our concierge team has been notified.',
      order: activeOrder
    };

    const memKey = razorpayPaymentId || razorpayOrderId || supabaseOrderId || 'mock_order';
    memoryFulfillmentResults.set(memKey, oversoldResult);

    return oversoldResult;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Create Secured Shipment in BVC Logistics API
  // ──────────────────────────────────────────────────────────────────────────
  let bvcStatus = 'shipment_pending';
  let bvcDocketNumber: string | null = null;
  let bvcShipmentId: string | null = null;
  let bvcSecurityBag: string | null = null;
  let bvcError: string | null = null;

  try {
    const nameParts = customerName.trim().split(/\s+/);
    const firstName = customerInfo?.first_name || nameParts[0] || 'Valued';
    const lastName = customerInfo?.last_name || nameParts.slice(1).join(' ') || '';
    const parsedGeo = parseCityAndState(shippingAddress, pincode);

    const bvcResult = await createBvcShipment({
      orderNumber,
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: customerEmail,
        phone: customerPhone,
        address: shippingAddress,
        city: customerInfo?.city || parsedGeo.city,
        state: customerInfo?.state || parsedGeo.state,
        pincode
      },
      items: (verifiedItems || []).map((it: any) => ({
        name: it.name || 'Fine Jewellery',
        product_id: it.product_id || it.id || 'AMB-ITEM',
        sku: it.sku || it.product_id || (it.name ? it.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase() : 'AMB-ITEM'),
        quantity: it.quantity || 1,
        price: it.price || it.unit_price_paise || 0,
        weight_grams: it.weight_grams,
        dimensions: it.dimensions
      })),
      totalAmountPaise: verifiedTotalPaise,
      razorpayPaymentId,
      razorpayOrderId
    });

    bvcStatus = bvcResult.status;
    bvcDocketNumber = bvcResult.docketNumber || null;
    bvcShipmentId = bvcResult.shipmentId || null;
    bvcSecurityBag = bvcResult.securityBagNumber || null;
    bvcError = bvcResult.errorMessage || null;

    if (!bvcResult.success && (bvcStatus === 'failed' || bvcStatus === 'exception')) {
      bvcStatus = 'shipment_failed';
      console.error('[BVC SHIPMENT FAILED]', { orderNumber, error: bvcError });
    } else {
      bvcStatus = 'shipment_created';
    }
  } catch (bvcErr) {
    bvcStatus = 'shipment_failed';
    bvcError = bvcErr instanceof Error ? bvcErr.message : 'Unexpected exception during BVC dispatch';
    console.error('[BVC LOGISTICS UNCAUGHT EXCEPTION]', bvcErr);
  }

  // Trigger Admin Email Alert if BVC Consignment Creation Failed
  if (bvcStatus === 'shipment_failed') {
    sendAdminBvcFailureAlert({
      orderNumber,
      razorpayPaymentId,
      razorpayOrderId,
      customerName,
      customerEmail,
      customerPhone,
      amount: verifiedTotalPaise,
      items: verifiedItems,
      errorMessage: bvcError || 'BVC shipment booking was not completed',
      securityBagNumber: bvcSecurityBag || undefined
    }).catch((alertErr) => {
      console.error('Failed to dispatch BVC failure alert to admin:', alertErr);
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Persist Confirmed Order & BVC Metadata to Supabase
  // ──────────────────────────────────────────────────────────────────────────
  const finalUpdatePayload: Record<string, unknown> = {
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    shipping_address: shippingAddress,
    pincode,
    status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'razorpay',
    payment_id: razorpayPaymentId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id: razorpayOrderId,
    bvc_status: bvcStatus,
    bvc_docket_number: bvcDocketNumber,
    bvc_shipment_id: bvcShipmentId,
    bvc_security_bag_number: bvcSecurityBag,
    shiprocket_status: bvcStatus,
    shiprocket_order_id: bvcDocketNumber ? String(bvcDocketNumber) : null,
    shiprocket_awb: bvcDocketNumber ? String(bvcDocketNumber) : null,
    shipping_provider: 'bvc',
    tracking_awb: bvcDocketNumber ? String(bvcDocketNumber) : null,
    updated_at: new Date().toISOString()
  };

  if (dbClient) {
    try {
      if (activeOrder?.id) {
        await dbClient
          .from('orders')
          .update(finalUpdatePayload)
          .eq('id', activeOrder.id);
      } else {
        // Mock fallback upsert
        await dbClient.from('orders').upsert({
          order_number: orderNumber,
          total: verifiedTotalPaise,
          subtotal: verifiedSubtotalPaise,
          tax: verifiedTaxPaise,
          shipping: 0,
          items: verifiedItems,
          ...finalUpdatePayload
        }, {
          onConflict: 'razorpay_payment_id',
          ignoreDuplicates: true
        });
      }
    } catch (dbErr) {
      console.error('Error persisting finalized order to Supabase:', dbErr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. Send Customer Order Confirmation Email via Resend
  // ──────────────────────────────────────────────────────────────────────────
  if (customerEmail) {
    try {
      await sendOrderConfirmationEmail({
        orderNumber,
        customerName,
        customerEmail,
        items: (verifiedItems || []).map((it: any) => ({
          name: it.name || 'Fine Jewellery',
          quantity: it.quantity || 1,
          price: it.price || it.unit_price_paise || 0,
          metal_finish: it.metal_finish
        })),
        subtotal: verifiedSubtotalPaise,
        tax: verifiedTaxPaise,
        shipping: 0,
        total: verifiedTotalPaise,
        shippingAddress,
        paymentId: razorpayPaymentId,
        bvcDocketNumber: bvcDocketNumber || undefined,
        securityBagNumber: bvcSecurityBag || undefined,
        shiprocketAwb: bvcDocketNumber || undefined
      });

      // Mark confirmation email sent in order notes
      if (activeOrder) {
        const currentNotes = activeOrder.notes || '';
        activeOrder.notes = currentNotes
          ? `${currentNotes}\n[CONFIRMATION_EMAIL_SENT]`
          : '[CONFIRMATION_EMAIL_SENT]';
      }

      if (dbClient && activeOrder?.id) {
        await dbClient
          .from('orders')
          .update({ notes: activeOrder.notes })
          .eq('id', activeOrder.id);
      }
    } catch (emailErr) {
      console.error('Background order confirmation email dispatch error:', emailErr);
    }
  }

  const orderAccessToken = generateOrderAccessToken(
    orderNumber,
    customerEmail || customerPhone
  );

  const successResult: FulfillmentResult = {
    success: true,
    orderNumber,
    orderAccessToken,
    paymentId: razorpayPaymentId,
    bvcStatus,
    bvcDocketNumber,
    bvcShipmentId,
    bvcSecurityBag,
    bvcError,
    order: activeOrder
  };

  const memKey = razorpayPaymentId || razorpayOrderId || supabaseOrderId || 'mock_order';
  memoryFulfillmentResults.set(memKey, successResult);

  return successResult;
}
