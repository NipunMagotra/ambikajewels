import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../src/app/api/track/route';
import { generateOrderAccessToken } from '../src/lib/encryption';

// Set test encryption secret for token verification
process.env.ENCRYPTION_SECRET = 'test_secret_for_order_tokens_32_characters_123';

test('1. IDOR Prevention: Rejects invoice lookup without proof of ownership (401 Unauthorized)', async () => {
  const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249');
  const res = await GET(req);
  const data = await res.json();

  assert.equal(res.status, 401);
  assert.equal(data.success, false);
  assert.equal(data.authRequired, true);
  assert.match(data.error, /Security Verification Required/i);
});

test('2. IDOR Prevention: Rejects invalid phone format or unauthorized access', async () => {
  const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&phone=123');
  const res = await GET(req);
  const data = await res.json();

  // Invalid 3-digit phone fails validation
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
  assert.match(data.error, /10-digit/i);
});

test('3. Proof of Ownership: Valid phone number grants authenticated invoice access (200 OK)', async () => {
  const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&phone=9682589725');
  const res = await GET(req);
  const data = await res.json();

  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.order);
  assert.ok(data.order.invoice);

  // Dynamic GST Tax Invoice validations
  const inv = data.order.invoice;
  assert.match(inv.invoice_number, /^AJ\/26-27\/108249/);
  assert.equal(inv.hsn_code, '7113');
  assert.ok(Array.isArray(inv.items) && inv.items.length > 0);
  assert.equal(inv.ca_confirmation_notice, 'Confirm GST treatment with CA');
  assert.equal(typeof inv.amount_in_words, 'string');
  assert.match(inv.amount_in_words, /^Rupees .* Only$/);

  // Purity copy: 6-character alphanumeric HUID
  assert.match(inv.items[0].purity, /6-character alphanumeric HUID/);

  // Intra-state GST for J&K
  assert.equal(inv.tax_split.type, 'intra_state');
  assert.equal(inv.tax_split.cgstRateText, '1.5%');
  assert.equal(inv.tax_split.sgstRateText, '1.5%');
});

test('4. Proof of Ownership: Valid signed HMAC token grants authenticated invoice access', async () => {
  const orderId = 'AMB-108249';
  const customerEmail = 'customer@example.com';
  const token = generateOrderAccessToken(orderId, customerEmail);

  const req = new Request(`http://localhost:3000/api/track?orderId=${orderId}&token=${token}&email=${customerEmail}`);
  const res = await GET(req);
  const data = await res.json();

  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(data.order.invoice);
  assert.equal(data.order.invoice.hsn_code, '7113');
});
