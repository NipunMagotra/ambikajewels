import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('Phase 3 Item 2: Policy Pages & Legal Drafting Audit', () => {
  const policyFiles = [
    'src/app/shipping-policy/page.tsx',
    'src/app/refund-policy/page.tsx',
    'src/app/exchange-policy/page.tsx',
    'src/app/custom-orders-policy/page.tsx',
    'src/app/privacy-policy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/grievance-policy/page.tsx',
    'src/app/authenticity/page.tsx',
  ];

  it('ensures every policy page contains the prominent DRAFT FOR LAWYER REVIEW banner', () => {
    for (const file of policyFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      assert.ok(fs.existsSync(fullPath), `Policy file missing: ${file}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.match(
        content,
        /DRAFT FOR LAWYER REVIEW/i,
        `File ${file} must display "DRAFT FOR LAWYER REVIEW"`
      );
    }
  });

  it('verifies Privacy Policy explicitly discloses all 5 authorized data processors', () => {
    const privacyContent = fs.readFileSync(path.resolve(process.cwd(), 'src/app/privacy-policy/page.tsx'), 'utf8');
    
    // 1. Supabase
    assert.match(privacyContent, /Supabase/i);
    // 2. Razorpay
    assert.match(privacyContent, /Razorpay/i);
    // 3. BVC Logistics
    assert.match(privacyContent, /BVC Logistics/i);
    // 4. Groq
    assert.match(privacyContent, /Groq/i);
    // 5. Cloud Hosting
    assert.match(privacyContent, /Netlify|Vercel|Hosting/i);
  });

  it('verifies Privacy Policy includes cross-border transfer safeguards and 8-year tax retention', () => {
    const privacyContent = fs.readFileSync(path.resolve(process.cwd(), 'src/app/privacy-policy/page.tsx'), 'utf8');
    
    // Cross-border transfer note
    assert.match(privacyContent, /Cross-Border Data Transfer/i);
    assert.match(privacyContent, /redact/i);
    
    // Retention schedule
    assert.match(privacyContent, /8 financial years|8 years/i);
    assert.match(privacyContent, /30 calendar days|30 days/i);
  });

  it('verifies Hallmark & Authenticity policy mandates 3 marks of BIS hallmarking including 6-char HUID', () => {
    const hallmarkContent = fs.readFileSync(path.resolve(process.cwd(), 'src/app/authenticity/page.tsx'), 'utf8');
    
    assert.match(hallmarkContent, /BIS Triangle Logo/i);
    assert.match(hallmarkContent, /6-character alphanumeric HUID|6-char/i);
    assert.match(hallmarkContent, /BIS Care/i);
  });

  it('verifies Grievance Redressal policy specifies statutory 48h acknowledgement and 30-day resolution', () => {
    const grievanceContent = fs.readFileSync(path.resolve(process.cwd(), 'src/app/grievance-policy/page.tsx'), 'utf8');
    
    assert.match(grievanceContent, /48 hours/i);
    assert.match(grievanceContent, /30.*days/i);
  });
});
