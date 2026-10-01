import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeLogString, sanitizeLogData } from '../src/lib/logger';
import { POST as dataRequestHandler } from '../src/app/api/data-request/route';

describe('Phase 3 Item 3: DPDP Act Compliance & Log Redaction', () => {
  describe('1. PII Redaction in Logs', () => {
    it('masks 10-digit Indian phone numbers in log strings', () => {
      const raw = 'Failed lookup for phone: 9682589725 and alternate: +91 9086098457';
      const sanitized = sanitizeLogString(raw);

      assert.ok(!sanitized.includes('9682589725'));
      assert.ok(!sanitized.includes('9086098457'));
      assert.match(sanitized, /968\*{4,5}25/);
      assert.match(sanitized, /908\*{4,5}57/);
    });

    it('masks customer email addresses in log strings', () => {
      const raw = 'Order confirmation sent to customer.sharma@example.com';
      const sanitized = sanitizeLogString(raw);

      assert.ok(!sanitized.includes('customer.sharma@example.com'));
      assert.match(sanitized, /c\*\*\*a@example\.com/);
    });

    it('masks customer PAN numbers in log strings', () => {
      const raw = 'Customer provided PAN ABCDE1234F for high value order';
      const sanitized = sanitizeLogString(raw);

      assert.ok(!sanitized.includes('ABCDE1234F'));
      assert.match(sanitized, /XXXXX1234X/);
    });

    it('sanitizes structured objects by redacting sensitive keys and values', () => {
      const payload = {
        customer_name: 'Ananya Sharma',
        customer_phone: '9876543210',
        customer_email: 'ananya@example.com',
        pan_number: 'ABCDE1234F',
        subtotal: 5000000
      };

      const sanitized = sanitizeLogData(payload);
      assert.equal(sanitized.pan_number, '[REDACTED_SENSITIVE_KEY]');
      assert.ok(!sanitized.customer_phone.includes('9876543210'));
      assert.ok(!sanitized.customer_email.includes('ananya@example.com'));
      assert.equal(sanitized.subtotal, 5000000);
    });
  });

  describe('2. Real Handler: POST /api/data-request (DPDP Rights Portal)', () => {
    it('rejects invalid requestType with 400', async () => {
      const req = new Request('http://localhost:3000/api/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'invalid_action',
          fullName: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '9876543210'
        })
      });

      const res = await dataRequestHandler(req);
      const data = await res.json();

      assert.equal(res.status, 400);
      assert.equal(data.success, false);
      assert.match(data.error, /invalid request type/i);
    });

    it('rejects invalid 3-digit phone with 400', async () => {
      const req = new Request('http://localhost:3000/api/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'access',
          fullName: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '123'
        })
      });

      const res = await dataRequestHandler(req);
      assert.equal(res.status, 400);
    });

    it('successfully logs an erasure request with reference ticket and states 8-year tax retention notice', async () => {
      const req = new Request('http://localhost:3000/api/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'erasure',
          fullName: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '9876543210',
          details: 'Please erase marketing profile data'
        })
      });

      const res = await dataRequestHandler(req);
      const data = await res.json();

      assert.equal(res.status, 200);
      assert.equal(data.success, true);
      assert.match(data.ticket_id, /^REQ-DPDP-/);
      assert.match(data.statutory_notice, /8-year retention|8 financial years/i);
      assert.match(data.statutory_notice, /Section 36 of CGST Act/i);
    });
  });
});
