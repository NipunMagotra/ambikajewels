import { siteConfig } from '@/config/siteConfig';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    metal_finish?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentId: string;
  shiprocketAwb?: string;
  bvcDocketNumber?: string;
  securityBagNumber?: string;
}

/**
 * Generates an official, compliant HTML Order Confirmation & GST Tax Receipt Email.
 * Can be sent via Resend, Nodemailer, SendGrid, or Netlify Email.
 */
export function generateOrderConfirmationEmailHtml(data: OrderEmailData): string {
  const formatInr = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const itemRows = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px 8px; font-size: 14px; color: #222;">
          <strong>${item.name}</strong><br />
          <span style="font-size: 12px; color: #666;">Finish: ${item.metal_finish || 'Gold'} | HSN: 7113</span>
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #222;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; color: #222; font-weight: bold;">
          ${formatInr(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Order Confirmation - ${siteConfig.legalBusinessName}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 20px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #d4af37; border-radius: 4px; overflow: hidden;">
          
          <!-- Header -->
          <tr style="background-color: #110909; text-align: center;">
            <td style="padding: 28px 20px;">
              <h1 style="color: #d4af37; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">${siteConfig.name}</h1>
              <p style="color: #c59b40; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px;">JAMMU &bull; FINE JEWELRY</p>
            </td>
          </tr>

          <!-- Confirmation Body -->
          <tr>
            <td style="padding: 30px 24px;">
              <h2 style="color: #222; font-size: 20px; margin-top: 0;">Payment Received & Verified</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Dear <strong>${data.customerName}</strong>,<br /><br />
                Thank you for choosing Ambika Jewels. Your payment has been received and verified via Razorpay. Your fine jewelry piece is now undergoing final quality control and hallmark inspection at our Jammu showroom before being packed in a tamper-evident security box for dispatch.
              </p>

              <!-- Order Summary Meta Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #faf8f5; border: 1px solid #eee; margin: 20px 0; border-radius: 4px;">
                <tr>
                  <td style="font-size: 13px; color: #555;">
                    <strong>Order Reference:</strong> ${data.orderNumber}<br />
                    <strong>Razorpay Payment ID:</strong> ${data.paymentId}<br />
                    <strong>Shipping Partner:</strong> BVC Logistics Secure Armed Network<br />
                    ${data.bvcDocketNumber || data.shiprocketAwb ? `<strong>Security Docket:</strong> ${data.bvcDocketNumber || data.shiprocketAwb}<br />` : ''}
                    ${data.securityBagNumber ? `<strong>Tamper Seal Bag:</strong> ${data.securityBagNumber}` : ''}
                  </td>
                  <td style="font-size: 13px; color: #555; text-align: right;">
                    <strong>GSTIN:</strong> ${siteConfig.gstin}<br />
                    <strong>BIS Hallmark:</strong> ${siteConfig.bisHallmarkLicense}<br />
                    <strong>Dispatch Window:</strong> 24 to 48 Hours
                  </td>
                </tr>
              </table>

              <!-- Items Table -->
              <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Order Details</h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f1ede4; border-bottom: 2px solid #d4af37;">
                    <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #333; text-transform: uppercase;">Item</th>
                    <th style="padding: 10px 8px; text-align: center; font-size: 12px; color: #333; text-transform: uppercase;">Qty</th>
                    <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #333; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Financial Breakdown -->
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-bottom: 20px;">
                <tr>
                  <td style="text-align: right; font-size: 13px; color: #666;">Subtotal:</td>
                  <td style="text-align: right; font-size: 13px; color: #333; width: 120px;">${formatInr(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="text-align: right; font-size: 13px; color: #666;">GST (3% Statutory Precious Metal Tax):</td>
                  <td style="text-align: right; font-size: 13px; color: #333;">${formatInr(data.tax)}</td>
                </tr>
                <tr>
                  <td style="text-align: right; font-size: 13px; color: #666;">Express Courier Transit:</td>
                  <td style="text-align: right; font-size: 13px; color: #2e7d32; font-weight: bold;">
                    ${data.shipping === 0 ? 'FREE' : formatInr(data.shipping)}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #333;">
                  <td style="text-align: right; font-size: 16px; font-weight: bold; color: #110909; padding-top: 10px;">Total Paid:</td>
                  <td style="text-align: right; font-size: 16px; font-weight: bold; color: #c59b40; padding-top: 10px;">
                    ${formatInr(data.total)}
                  </td>
                </tr>
              </table>

              <!-- Delivery Address -->
              <div style="background-color: #faf8f5; border: 1px solid #eee; padding: 14px; border-radius: 4px; margin-bottom: 24px;">
                <strong style="font-size: 13px; color: #333; text-transform: uppercase;">Delivery Destination:</strong>
                <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">
                  ${data.shippingAddress}
                </p>
              </div>

              <!-- Live Tracking CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ambikajewelsshop.com/track?orderId=${data.orderNumber}" style="background-color: #c59b40; color: #110909; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 2px; display: inline-block; letter-spacing: 1px; text-transform: uppercase;">
                  Track Consignment Live
                </a>
              </div>

              <!-- Hallmarking & Trust Notice -->
              <div style="border-top: 1px solid #e0e0e0; padding-top: 16px; font-size: 12px; color: #777; line-height: 1.5;">
                <p>
                  <strong>BIS Hallmark Guarantee:</strong> All gold items are officially hallmarked with a unique 6-character alphanumeric laser HUID in accordance with Bureau of Indian Standards regulations.
                </p>
                <p>
                  <strong>Delivery Verification:</strong> Inspect the serialized security tape on arrival. Do not accept if broken.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr style="background-color: #1a1111; color: #aaa; text-align: center;">
            <td style="padding: 20px; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0; color: #d4af37; font-weight: bold;">${siteConfig.legalBusinessName}</p>
              <p style="margin: 4px 0;">${siteConfig.address}</p>
              <p style="margin: 4px 0;">Contact: ${siteConfig.contact.phone} | ${siteConfig.contact.email}</p>
              <p style="margin: 8px 0 0 0; color: #666; font-size: 11px;">
                Grievance Officer: ${siteConfig.grievanceOfficer.name} (${siteConfig.grievanceOfficer.email})
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends order confirmation email via Resend API.
 * Uses process.env.RESEND_API_KEY.
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Marked TODO: Waiting for real Resend API key
    console.warn(`[EMAIL TODO] RESEND_API_KEY is not configured in .env.local. Order confirmation email to ${data.customerEmail} simulated for Order #${data.orderNumber}.`);
    return { success: false, error: 'RESEND_API_KEY_NOT_CONFIGURED' };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Ambika Jewels <orders@ambikajewelsshop.com>';
    const htmlContent = generateOrderConfirmationEmailHtml(data);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [data.customerEmail],
        subject: `Order Confirmation #${data.orderNumber} - ${siteConfig.name}`,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (response.ok && result.id) {
      console.log(`[RESEND EMAIL SENT] Confirmation sent to ${data.customerEmail} (ID: ${result.id})`);
      return { success: true, id: result.id };
    } else {
      console.error('[RESEND EMAIL FAILED]', result);
      return { success: false, error: result.message || 'Resend API returned an error' };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network exception during email dispatch';
    console.error('[RESEND EMAIL EXCEPTION]', err);
    return { success: false, error: errorMsg };
  }
}

export interface BvcFailureAlertData {
  orderNumber: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number; // in paise
  items: Array<{ name: string; quantity: number; price: number }>;
  errorMessage: string;
  securityBagNumber?: string;
}

export type ShiprocketFailureAlertData = BvcFailureAlertData;

/**
 * Sends an urgent administrator alert email when a customer has paid via Razorpay
 * but the automated BVC Logistics eSHIP consignment creation fails.
 */
export async function sendAdminBvcFailureAlert(
  data: BvcFailureAlertData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || siteConfig.contact.email;

  const formatInr = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const itemSummary = data.items
    .map((it) => `• ${it.name} (Qty: ${it.quantity}) - ${formatInr(it.price * it.quantity)}`)
    .join('<br />');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CRITICAL: BVC Logistics Consignment Booking Failed</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #fff4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #d32f2f; border-radius: 6px; padding: 24px;">
    <h2 style="color: #d32f2f; margin-top: 0; font-size: 20px;">
      🚨 CRITICAL ALERT: Payment Succeeded but BVC Logistics Booking Failed
    </h2>
    <p style="font-size: 14px; color: #333; line-height: 1.6;">
      A customer has successfully completed payment for high-value gold jewelry on <strong>Ambika Jewels</strong>, but the automatic armored consignment booking in BVC eSHIP failed.
      <strong>Please manually create this secured shipment in your BVC Universe dashboard immediately to assign armored pickup and tamper-evident sealing.</strong>
    </p>

    <div style="background-color: #fce8e6; border: 1px solid #f5c2c7; border-radius: 4px; padding: 12px; margin: 16px 0; font-size: 13px; color: #721c24;">
      <strong>Error Detail:</strong> ${data.errorMessage}
    </div>

    <h3 style="font-size: 15px; color: #111; margin-bottom: 8px;">Order Details:</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 13px; color: #333; margin-bottom: 16px;">
      <tr><td style="font-weight: bold; width: 160px;">Order Reference:</td><td>${data.orderNumber}</td></tr>
      <tr><td style="font-weight: bold;">Razorpay Payment ID:</td><td>${data.razorpayPaymentId}</td></tr>
      ${data.razorpayOrderId ? `<tr><td style="font-weight: bold;">Razorpay Order ID:</td><td>${data.razorpayOrderId}</td></tr>` : ''}
      <tr><td style="font-weight: bold;">Declared Gold Value:</td><td style="font-weight: bold; color: #2e7d32;">${formatInr(data.amount)}</td></tr>
      <tr><td style="font-weight: bold;">Customer Name:</td><td>${data.customerName}</td></tr>
      <tr><td style="font-weight: bold;">Customer Phone:</td><td><a href="tel:${data.customerPhone}">${data.customerPhone}</a></td></tr>
      <tr><td style="font-weight: bold;">Customer Email:</td><td><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
      ${data.securityBagNumber ? `<tr><td style="font-weight: bold;">Tamper Seal Bag:</td><td><code>${data.securityBagNumber}</code></td></tr>` : ''}
      <tr><td style="font-weight: bold;">Product HSN Code:</td><td>7113 (Gold Ornaments)</td></tr>
    </table>

    <h3 style="font-size: 15px; color: #111; margin-bottom: 8px;">Purchased Items:</h3>
    <div style="background-color: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 4px; font-size: 13px; color: #444; margin-bottom: 20px;">
      ${itemSummary}
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://universe.bvclogistics.com" style="background-color: #d32f2f; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; display: inline-block;">
        Open BVC Universe Dashboard
      </a>
    </div>

    <p style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 12px; margin-bottom: 0;">
      Notification dispatched automatically by Ambika Jewels Security Gateway (${new Date().toISOString()}).
    </p>
  </div>
</body>
</html>
  `;

  if (!apiKey) {
    console.error('[ADMIN EMAIL ALERT - BVC BOOKING FAILED]', {
      recipient: adminEmail,
      order: data.orderNumber,
      paymentId: data.razorpayPaymentId,
      error: data.errorMessage,
      notice: 'RESEND_API_KEY is not configured in .env.local. Logged alert directly to console.'
    });
    return { success: false, error: 'RESEND_API_KEY_NOT_CONFIGURED' };
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Ambika Jewels Alerts <alerts@ambikajewelsshop.com>';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        subject: `🚨 [URGENT] BVC Logistics Consignment Failed for Order #${data.orderNumber}`,
        html,
      }),
    });

    const result = await response.json();
    if (response.ok && result.id) {
      console.log(`[BVC FAILURE ALERT SENT] Alert email dispatched to admin (${adminEmail}) (ID: ${result.id})`);
      return { success: true, id: result.id };
    } else {
      console.error('[BVC FAILURE ALERT FAILED]', result);
      return { success: false, error: result.message || 'Resend error' };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network exception during admin alert email';
    console.error('[BVC FAILURE ALERT EXCEPTION]', err);
    return { success: false, error: errorMsg };
  }
}

// Backward-compatibility alias
export const sendAdminShiprocketFailureAlert = sendAdminBvcFailureAlert;

