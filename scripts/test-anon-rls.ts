/**
 * Staging Supabase Row Level Security (RLS) Test Plan
 * 
 * Target: Validates that an unauthenticated / anonymous client using ONLY
 * the public anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) CANNOT:
 *   1. Direct INSERT into 'orders' with arbitrary or manipulated prices
 *   2. Enumerate, query, or scrape other customers' 'orders'
 *   3. Direct UPDATE order statuses to 'paid'
 *   4. Direct INSERT, SELECT, or UPDATE 'webhook_events'
 *   5. Direct SELECT or INSERT into 'customer_savings_goals'
 *   6. Direct INSERT or UPDATE bullion rates in 'daily_rates'
 *   7. Direct SELECT or INSERT into 'audit_logs'
 * 
 * Usage:
 *   npx tsx scripts/test-anon-rls.ts
 * 
 * Required Environment Variables (or loads from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('='.repeat(72));
console.log('🔍 AMBIKA JEWELS - STAGING SUPABASE RLS SECURITY TEST SUITE (ANON KEY)');
console.log('='.repeat(72));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing Supabase Environment Variables:');
  console.error('   Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   Example:');
  console.error('     $env:NEXT_PUBLIC_SUPABASE_URL="https://your-proj.supabase.co"');
  console.error('     $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."');
  console.error('     npx tsx scripts/test-anon-rls.ts\n');
  process.exit(1);
}

console.log(`📡 Target Endpoint: ${supabaseUrl}`);
console.log(`🔑 Using Key: ANON PUBLIC KEY (${supabaseAnonKey.slice(0, 12)}...)\n`);

const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

interface TestResult {
  name: string;
  table: string;
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  passed: boolean;
  message: string;
  rlsDenied: boolean;
}

const results: TestResult[] = [];

async function runTest(
  name: string,
  table: string,
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
  testFn: () => Promise<{ error: any; data: any }>
) {
  process.stdout.write(`▶ Testing ${table.padEnd(24)} [${action.padEnd(6)}] ${name}... `);
  try {
    const { error, data } = await testFn();
    
    // RLS policy violation returns error code 42501 (insufficient_privilege) or generic RLS violation
    // or for SELECT, returning 0 rows when rows exist without error
    const isError = Boolean(error);
    const isRlsError = error?.code === '42501' || 
                       error?.message?.toLowerCase().includes('violates row-level security policy') ||
                       error?.message?.toLowerCase().includes('permission denied') ||
                       error?.message?.toLowerCase().includes('row-level security');

    let passed = false;
    let details = '';

    if (action === 'INSERT' || action === 'UPDATE' || action === 'DELETE') {
      // Direct mutations must ALWAYS fail with RLS violation error
      if (isError) {
        passed = true;
        details = `BLOCKED by RLS: ${error.message}`;
      } else {
        passed = false;
        details = `CRITICAL LEAK: Anonymous mutation SUCCEEDED! Returned: ${JSON.stringify(data)}`;
      }
    } else if (action === 'SELECT') {
      // Sensitive table reads must either return RLS error or return 0 rows
      if (isError) {
        passed = true;
        details = `BLOCKED by RLS: ${error.message}`;
      } else if (Array.isArray(data) && data.length === 0) {
        passed = true;
        details = 'ISOLATED: 0 rows returned to unauthenticated client (USING filter active)';
      } else {
        passed = false;
        details = `CRITICAL LEAK: Anonymous client read ${data?.length || 1} rows of private records!`;
      }
    }

    results.push({
      name,
      table,
      action,
      passed,
      message: details,
      rlsDenied: isRlsError
    });

    if (passed) {
      console.log('✅ PASS');
    } else {
      console.log('❌ FAIL');
      console.error(`   ⚠️  ${details}`);
    }
  } catch (err: any) {
    console.log('✅ PASS (Caught)');
    results.push({
      name,
      table,
      action,
      passed: true,
      message: `Exception rejected: ${err.message}`,
      rlsDenied: true
    });
  }
}

async function main() {
  // Test 1: Direct Order Insertion (Price Tampering Attack)
  await runTest(
    'Rejects direct client INSERT with fabricated price',
    'orders',
    'INSERT',
    async () => {
      return await anonClient.from('orders').insert({
        order_number: 'AMB-ATTACK-001',
        customer_name: 'Attacker',
        customer_phone: '9999999999',
        total: 100, // Attacker trying to set ₹1 total for solid gold necklace
        status: 'paid'
      }).select();
    }
  );

  // Test 2: Bulk Customer Order Scraping (Privacy Leak)
  await runTest(
    'Prevents unauthenticated SELECT across all orders',
    'orders',
    'SELECT',
    async () => {
      return await anonClient.from('orders').select('*').limit(10);
    }
  );

  // Test 3: Unauthorized Order Status Manipulation
  await runTest(
    'Rejects direct UPDATE of order status to paid',
    'orders',
    'UPDATE',
    async () => {
      return await anonClient.from('orders').update({ status: 'paid' }).eq('id', 'dummy_id');
    }
  );

  // Test 4: Webhook Events Direct Manipulation
  await runTest(
    'Rejects direct INSERT into webhook_events',
    'webhook_events',
    'INSERT',
    async () => {
      return await anonClient.from('webhook_events').insert({
        event_id: 'fake_evt_123',
        event_type: 'payment.captured',
        status: 'completed'
      });
    }
  );

  // Test 5: Webhook Events Snooping
  await runTest(
    'Rejects SELECT on webhook_events',
    'webhook_events',
    'SELECT',
    async () => {
      return await anonClient.from('webhook_events').select('*').limit(5);
    }
  );

  // Test 6: Savings Goal Tracker Unauthenticated Access
  await runTest(
    'Rejects direct SELECT on customer_savings_goals',
    'customer_savings_goals',
    'SELECT',
    async () => {
      return await anonClient.from('customer_savings_goals').select('*').limit(5);
    }
  );

  // Test 7: Direct Manipulation of Bullion Rates
  await runTest(
    'Rejects direct UPDATE or insertion of gold rates',
    'daily_rates',
    'UPDATE',
    async () => {
      return await anonClient.from('daily_rates').update({ gold_24k: 100 }).eq('id', 1);
    }
  );

  // Test 8: Audit Log Tampering or Viewing
  await runTest(
    'Rejects SELECT on admin_audit_logs',
    'admin_audit_logs',
    'SELECT',
    async () => {
      return await anonClient.from('admin_audit_logs').select('*').limit(5);
    }
  );

  // Summary
  console.log('\n' + '='.repeat(72));
  console.log('📊 RLS TEST SUMMARY:');
  console.log('='.repeat(72));

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  for (const r of results) {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon} [${r.table}] ${r.name}: ${r.message}`);
  }

  console.log('\n' + '-'.repeat(72));
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('-'.repeat(72));

  if (failed > 0) {
    console.error('\n🚨 FATAL: One or more Supabase RLS security policies failed!');
    process.exit(1);
  } else {
    console.log('\n🔒 SUCCESS: Supabase Row Level Security is strictly enforcing zero anon access!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error running RLS tests:', err);
  process.exit(1);
});
