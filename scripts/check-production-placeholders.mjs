/**
 * Production Readiness Check: Mandatory Owner KYC & Statutory Disclosures
 * 
 * Target: Fails the build/deployment in production if any '[TO BE FILLED BY OWNER]'
 * placeholder remains in statutory fields (GSTIN, PAN, BIS Licence, Legal Entity Type).
 * 
 * Usage:
 *   node scripts/check-production-placeholders.mjs
 */

import { siteConfig } from '../src/config/siteConfig.ts';

const isProduction = process.env.NODE_ENV === 'production' || process.env.CHECK_PRODUCTION_READINESS === 'true';

console.log('='.repeat(72));
console.log('🔍 AMBIKA JEWELS - STATUTORY OWNER DATA DISCLOSURE CHECK');
console.log('='.repeat(72));

const checks = [
  { field: 'GSTIN (15-Digit)', value: siteConfig.gstin, envVar: 'STORE_GSTIN' },
  { field: 'PAN (10-Character)', value: siteConfig.pan, envVar: 'STORE_PAN' },
  { field: 'BIS Hallmark License', value: siteConfig.bisHallmarkLicense, envVar: 'STORE_BIS_LICENSE' },
  { field: 'Legal Entity Type', value: siteConfig.legalEntityType, envVar: 'STORE_ENTITY_TYPE' },
  { field: 'Legal Business Name', value: siteConfig.legalBusinessName, envVar: 'STORE_LEGAL_NAME' }
];

const pendingFields = [];

for (const c of checks) {
  const isPlaceholder = !c.value || c.value.includes('[TO BE FILLED BY OWNER]') || c.value.trim() === '';
  if (isPlaceholder) {
    pendingFields.push(c);
  }
}

if (pendingFields.length > 0) {
  console.log(`\n⚠️  Found ${pendingFields.length} statutory field(s) containing owner placeholders:`);
  for (const f of pendingFields) {
    console.log(`   - ${f.field.padEnd(25)}: Current value: "${f.value}" (Set via ${f.envVar})`);
  }

  if (isProduction) {
    console.error('\n' + '!'.repeat(72));
    console.error('🚨 [COMPLIANCE FATAL] PRODUCTION BUILD FAILED');
    console.error('   Consumer Protection (E-Commerce) Rules and Legal Metrology mandate');
    console.error('   that all live e-commerce websites must publish verified seller details.');
    console.error('   Please configure the required environment variables in your deployment settings:');
    for (const f of pendingFields) {
      console.error(`     • ${f.envVar}="<your-official-${f.field.toLowerCase()}>"`);
    }
    console.error('!'.repeat(72) + '\n');
    process.exit(1);
  } else {
    console.log('\nℹ️  Development Mode: Build permitted with placeholders.');
    console.log('   In production (NODE_ENV=production or CHECK_PRODUCTION_READINESS=true), this check will block deployment until filled.\n');
    process.exit(0);
  }
} else {
  console.log('\n✅ All statutory owner disclosures and KYC identifiers are verified.');
  console.log('   No placeholder text found.\n');
  process.exit(0);
}
