import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

process.env.ADMIN_SESSION_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';

import { createAdminSessionToken } from '../src/lib/adminAuth';
import { GET as getProducts, POST as postProducts, PATCH as patchProducts, DELETE as deleteProducts } from '../src/app/api/admin/products/route';
import { GET as getCoupons, POST as postCoupons, PATCH as patchCoupons, DELETE as deleteCoupons } from '../src/app/api/admin/coupons/route';
import { GET as getContent, POST as postContent } from '../src/app/api/admin/content/route';
import { GET as getAuditLogs } from '../src/app/api/admin/audit/route';
import { POST as uploadImage } from '../src/app/api/admin/upload/route';
import { validateCoupon } from '../src/lib/couponEngine';
import { recordAuditLog, getRecentAuditLogs } from '../src/lib/auditLog';

describe('Phase 9: Complete Store Owner Management System Test Suite', () => {
  const adminToken = createAdminSessionToken();
  const authHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  // ── 1. Security & Authentication Gate ──────────────────────────────
  describe('1. Zero-Trust Admin Authentication Enforcements', () => {
    it('strictly blocks unauthenticated GET /api/admin/products with 401', async () => {
      const res = await getProducts();
      assert.equal(res.status, 401);
    });

    it('strictly blocks unauthenticated POST /api/admin/products with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ name: 'Hacked Ring', price: 1000 })
      });
      const res = await postProducts(req);
      assert.equal(res.status, 401);
    });

    it('strictly blocks unauthenticated GET /api/admin/coupons with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/coupons');
      const res = await getCoupons(req);
      assert.equal(res.status, 401);
    });

    it('strictly blocks unauthenticated GET /api/admin/content with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/content');
      const res = await getContent(req);
      assert.equal(res.status, 401);
    });

    it('strictly blocks unauthenticated GET /api/admin/audit with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/audit');
      const res = await getAuditLogs(req);
      assert.equal(res.status, 401);
    });

    it('strictly blocks unauthenticated POST /api/admin/upload with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: new FormData()
      });
      const res = await uploadImage(req);
      assert.equal(res.status, 401);
    });
  });

  // ── 2. Product Management (CRUD, Specs, Duplicate, Bulk) ───────────
  describe('2. Comprehensive Jewellery Product Operations', () => {
    let createdProductId = '';

    it('creates a new handcrafted piece with full jewellery & hallmarking specifications', async () => {
      const newProductPayload = {
        name: 'Royal Dogra Trikuta Bridal Choker',
        category: 'Necklaces',
        price: 185000, // ₹1,85,000
        description: 'Exquisite 22K gold bridal choker with traditional Dogra filigree and Burma ruby drops.',
        images: ['/products/royal-kundan.png'],
        badges: ['22K BIS', 'DOGRA HERITAGE', 'NEW'],
        metal_finishes: ['Gold', 'Antique Gold'],
        stock_status: 'in_stock',
        is_featured: true,
        collection: 'Dogra Heritage Collection',
        material: '22K Solid Gold (BIS Hallmarked)',
        purity: '22K (916 Purity)',
        bis_hallmark: 'BIS Hallmarked with 6-character HUID',
        is_hallmarked: true,
        huid: 'DG916A',
        weight_grams: 28.5,
        gross_weight_grams: 30.2,
        dimensions: { length_cm: 18.0, breadth_cm: 3.5, height_cm: 1.0 },
        hsn_code: '7113',
        making_charge_type: 'percent',
        making_charge_rate: 10,
        stone_weight_grams: 1.7,
        stone_value_paise: 1500000,
        pricing_mode: 'live_bullion'
      };

      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newProductPayload)
      });

      const res = await postProducts(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.ok(json.product.id);
      assert.equal(json.product.name, 'Royal Dogra Trikuta Bridal Choker');
      assert.equal(json.product.price, 18500000); // 1,85,000 in paise
      assert.equal(json.product.huid, 'DG916A');
      assert.equal(json.product.weight_grams, 28.5);

      createdProductId = json.product.id;
    });

    it('updates an existing product with new details', async () => {
      assert.ok(createdProductId);

      const updatePayload = {
        id: createdProductId,
        stock_status: 'limited',
        price: 190000, // Price revised to ₹1,90,000
        craftsmanship_story: 'Handcrafted by master Dogra goldsmiths in Old Jammu City.'
      };

      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(updatePayload)
      });

      const res = await patchProducts(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.product.stock_status, 'limited');
      assert.equal(json.product.price, 19000000);
    });

    it('duplicates an existing product creating a distinct clone', async () => {
      assert.ok(createdProductId);

      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ action: 'duplicate', id: createdProductId })
      });

      const res = await postProducts(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.notEqual(json.product.id, createdProductId);
      assert.ok(json.product.name.includes('(Copy)'));
    });

    it('performs bulk update of stock and prices on multiple pieces', async () => {
      assert.ok(createdProductId);

      const bulkPayload = {
        action: 'bulk_update',
        product_ids: [createdProductId],
        updates: {
          stock_status: 'in_stock',
          pricePercentDelta: 5 // +5% price adjustment
        }
      };

      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(bulkPayload)
      });

      const res = await patchProducts(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.updatedCount, 1);
      // Previous price was 19000000; +5% = 19950000
      assert.equal(json.products[0].price, 19950000);
    });

    it('deletes the test product cleanly', async () => {
      assert.ok(createdProductId);

      const req = new Request(`http://localhost:3000/api/admin/products?id=${createdProductId}`, {
        method: 'DELETE',
        headers: authHeaders
      });

      const res = await deleteProducts(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
    });
  });

  // ── 3. Image Upload Security & Validation ──────────────────────────
  describe('3. Image Upload Verification', () => {
    it('rejects uploads with invalid MIME type (e.g. text/plain)', async () => {
      const formData = new FormData();
      const textBlob = new Blob(['invalid script data'], { type: 'text/plain' });
      formData.append('file', textBlob, 'exploit.txt');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData
      });

      const res = await uploadImage(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('Invalid file type'));
    });

    it('accepts valid JPEG image and returns accessible URL', async () => {
      const formData = new FormData();
      // Valid minimal 1x1 JPEG bytes decoded and re-encoded by Sharp
      const validJpgBuffer = Buffer.from('/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAABv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJwAHgT/2Q==', 'base64');
      const blob = new Blob([validJpgBuffer], { type: 'image/jpeg' });
      formData.append('file', blob, 'sample_jewel.jpg');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData
      });

      const res = await uploadImage(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.ok(json.url);
    });
  });

  // ── 4. Coupon CRUD & Server Authority ──────────────────────────────
  describe('4. Promotional Discount Coupon Management', () => {
    const testCode = 'FESTIVE2026';

    it('creates a new promotional coupon via admin API', async () => {
      const couponPayload = {
        code: testCode,
        type: 'flat',
        value: 750000, // ₹7,500
        minOrderPaise: 6000000, // Min ₹60,000
        validUntil: '2027-12-31',
        description: 'Diwali Royal Offer: ₹7,500 off on orders above ₹60,000.',
        isActive: true
      };

      const req = new Request('http://localhost:3000/api/admin/coupons', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(couponPayload)
      });

      const res = await postCoupons(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.coupon.code, testCode);
    });

    it('validates the newly created coupon server-side against customer cart', () => {
      // Cart subtotal ₹75,000 (qualifies for ₹7,500 discount)
      const result = validateCoupon(testCode, 7500000);
      assert.equal(result.isValid, true);
      assert.equal(result.discountPaise, 750000);

      // Cart subtotal ₹40,000 (fails minimum order threshold of ₹60,000)
      const failResult = validateCoupon(testCode, 4000000);
      assert.equal(failResult.isValid, false);
      assert.ok(failResult.message.includes('requires a minimum order'));
    });

    it('toggles coupon active/inactive status', async () => {
      const req = new Request('http://localhost:3000/api/admin/coupons', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ code: testCode, isActive: false })
      });

      const res = await patchCoupons(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.coupon.isActive, false);

      // Validating now must fail
      const disabledCheck = validateCoupon(testCode, 8000000);
      assert.equal(disabledCheck.isValid, false);
    });

    it('deletes the test coupon', async () => {
      const req = new Request(`http://localhost:3000/api/admin/coupons?code=${testCode}`, {
        method: 'DELETE',
        headers: authHeaders
      });

      const res = await deleteCoupons(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
    });
  });

  // ── 5. Website Content Management ──────────────────────────────────
  describe('5. Website Content Manager', () => {
    it('retrieves current website hero and showroom settings', async () => {
      const req = new Request('http://localhost:3000/api/admin/content', {
        headers: authHeaders
      });

      const res = await getContent(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.ok(json.content.hero);
      assert.ok(json.content.announcement);
      assert.ok(json.content.showroom);
    });

    it('updates announcement bar text and hero headline', async () => {
      const updatePayload = {
        announcement: {
          isEnabled: true,
          text: 'Special Wedding Season Offer: Visit Jammu Showroom for Exclusive Bridal Sets'
        }
      };

      const req = new Request('http://localhost:3000/api/admin/content', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(updatePayload)
      });

      const res = await postContent(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.equal(json.content.announcement.text, updatePayload.announcement.text);
    });
  });

  // ── 6. Tamper-Evident Audit Logging ────────────────────────────────
  describe('6. Store Activity & Audit Logging', () => {
    it('records and returns audit trail events', async () => {
      await recordAuditLog({
        staffEmail: 'owner@ambikajewels.com',
        staffName: 'Shivani Anand',
        action: 'VERIFICATION_AUDIT_LOG_TEST',
        entityType: 'product',
        entityId: 'TEST_ID_101',
        newValues: { test: true }
      });

      const logs = await getRecentAuditLogs(20);
      assert.ok(logs.length > 0);
      const found = logs.find(l => l.action === 'VERIFICATION_AUDIT_LOG_TEST');
      assert.ok(found);
      assert.equal(found.staff_email, 'owner@ambikajewels.com');
    });

    it('serves audit log history to authenticated admin API', async () => {
      const req = new Request('http://localhost:3000/api/admin/audit?limit=25', {
        headers: authHeaders
      });

      const res = await getAuditLogs(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.ok(Array.isArray(json.logs));
    });
  });
});
