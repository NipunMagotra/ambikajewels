import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rateLimit';
import { siteConfig } from '@/config/siteConfig';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { secureLogger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Rate limiting (5 requests per 15 minutes)
    const rateCheck = await checkRateLimit('dataRequest', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a few minutes before submitting another privacy request.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { requestType, fullName, email, phone, details } = body;

    if (!requestType || !['access', 'correction', 'erasure'].includes(requestType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request type. Must be access, correction, or erasure.' },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full legal name.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Generate unique DPDP request tracking ticket
    const ticketId = `REQ-DPDP-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Sanitized log using privacy-preserving logger
    secureLogger.info(`DPDP Request logged: ${ticketId} [${requestType}] for user ${fullName} (${cleanPhone})`);

    // Store in Supabase if configured
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    if (dbClient) {
      try {
        await dbClient.from('data_subject_requests').insert({
          ticket_id: ticketId,
          request_type: requestType,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          details: details ? String(details).slice(0, 1000) : '',
          status: 'pending',
          created_at: new Date().toISOString()
        });
      } catch (dbErr) {
        secureLogger.warn(`Could not persist data_subject_request to DB (table may not exist in staging):`, dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      message: `Your DPDP privacy request (${requestType.toUpperCase()}) has been received and logged under reference ${ticketId}. Our Grievance Officer (${siteConfig.grievanceOfficer.name}) will acknowledge within 48 hours and process your request within 30 calendar days.`,
      statutory_notice: 'Statutory Notice: Indian tax laws (Section 36 of CGST Act and Income Tax Act Section 44AB) mandate 8-year retention of official tax invoices and financial transactions. Financial and invoice records cannot be erased prior to statutory limitation expiry (verify with CA/lawyer).'
    });
  } catch (error: any) {
    secureLogger.error('Exception handling DPDP data request:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while processing your privacy request.' },
      { status: 500 }
    );
  }
}
