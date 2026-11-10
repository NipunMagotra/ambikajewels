import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { secureLogger } from '@/lib/logger';
import { siteConfig } from '@/config/siteConfig';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate limit: 5 inquiries per 10 minutes
    const rateCheck = await checkRateLimit('contact', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many messages sent. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, phone, subject, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a message or inquiry details (minimum 5 characters).' },
        { status: 400 }
      );
    }

    // Log contact enquiry securely
    secureLogger.info(
      `[CONTACT ENQUIRY] From: ${name.trim()} (${cleanPhone}, ${email.trim()}) | Subject: ${subject || 'General'} | Msg: ${message.trim().slice(0, 200)}`
    );

    // If Resend API key is available, send notification to showroom admin
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && !resendApiKey.includes('placeholder')) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Ambika Jewels <orders@ambikajewelsonline.com>',
            to: [siteConfig.contact.email],
            reply_to: email.trim(),
            subject: `[Showroom Enquiry] ${subject || 'New Contact Request'} - ${name.trim()}`,
            text: `New customer inquiry received:\n\nName: ${name.trim()}\nPhone: +91 ${cleanPhone}\nEmail: ${email.trim()}\nSubject: ${subject || 'General'}\n\nMessage:\n${message.trim()}`,
          }),
        });
      } catch (emailErr) {
        console.warn('[CONTACT EMAIL] Notification dispatch to admin failed:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting Ambika Jewels. Our Jammu showroom concierge will connect with you within 24 business hours.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[CONTACT API EXCEPTION]', err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

