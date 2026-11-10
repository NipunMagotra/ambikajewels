import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { secureLogger } from '@/lib/logger';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate limit: 5 requests per 10 minutes
    const rateCheck = await checkRateLimit('newsletter', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many subscription attempts. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Log subscription event
    secureLogger.info(`[NEWSLETTER SUBSCRIPTION] New subscriber: ${cleanEmail}`);

    // If Supabase is configured, record subscriber in newsletter_subscribers table if present
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    if (dbClient) {
      try {
        await dbClient.from('newsletter_subscribers').upsert(
          {
            email: cleanEmail,
            subscribed_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );
      } catch (dbErr) {
        // Non-fatal if table not migrated yet
        console.warn('[NEWSLETTER DB NOTICE] Subscription DB persist skipped:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to Ambika Jewels Privé. You are now subscribed to our couture releases and bridal previews.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

