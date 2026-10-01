import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 3 Item 9: Accessibility (a11y) on Checkout and PDP', () => {
  describe('1. Checkout Form Accessibility', () => {
    const checkoutPath = path.join(process.cwd(), 'src/app/checkout/page.tsx');
    const content = fs.readFileSync(checkoutPath, 'utf-8');

    it('ensures all customer input fields have matching label htmlFor and input id pairs', () => {
      const requiredFieldIds = [
        'checkout-first-name',
        'checkout-last-name',
        'checkout-phone',
        'checkout-email',
        'checkout-address',
        'checkout-city',
        'checkout-state',
        'checkout-pincode',
        'checkout-pan',
        'checkout-notes',
        'checkout-agree-terms',
        'checkout-marketing-consent',
      ];

      for (const fieldId of requiredFieldIds) {
        assert.ok(
          content.includes(`htmlFor="${fieldId}"`),
          `Missing label htmlFor="${fieldId}" in checkout page`
        );
        assert.ok(
          content.includes(`id="${fieldId}"`),
          `Missing input id="${fieldId}" in checkout page`
        );
      }
    });

    it('includes browser standard autoComplete values for checkout input efficiency', () => {
      assert.ok(content.includes('autoComplete="given-name"'));
      assert.ok(content.includes('autoComplete="family-name"'));
      assert.ok(content.includes('autoComplete="tel"'));
      assert.ok(content.includes('autoComplete="email"'));
      assert.ok(content.includes('autoComplete="street-address"'));
      assert.ok(content.includes('autoComplete="postal-code"'));
    });

    it('ensures visible focus states on form elements', () => {
      assert.ok(content.includes('focus-visible:ring-1'));
    });
  });

  describe('2. Product Detail Page (PDP) Accessibility', () => {
    const pdpPath = path.join(process.cwd(), 'src/components/catalog/ProductDetailClient.tsx');
    const content = fs.readFileSync(pdpPath, 'utf-8');

    it('ensures quantity controls have descriptive aria-labels and live regions', () => {
      assert.ok(content.includes('aria-label="Decrease quantity"'));
      assert.ok(content.includes('aria-label="Increase quantity"'));
      assert.ok(content.includes('aria-live="polite"'));
    });

    it('ensures image gallery thumbnails have aria-label and aria-pressed states', () => {
      assert.ok(content.includes('aria-label={`View image ${i + 1} of ${product.name}`'));
      assert.ok(content.includes('aria-pressed={activeImage === img}'));
    });

    it('ensures metal finish selectors have radiogroup semantics and aria-pressed states', () => {
      assert.ok(content.includes('role="radiogroup"'));
      assert.ok(content.includes('aria-label={`Select ${finish} metal finish`'));
      assert.ok(content.includes('aria-pressed={selectedFinish === finish}'));
    });

    it('ensures price breakup toggle has aria-expanded and aria-controls linking to its region', () => {
      assert.ok(content.includes('aria-expanded={showPriceBreakup}'));
      assert.ok(content.includes('aria-controls="pdp-price-breakup-details"'));
      assert.ok(content.includes('id="pdp-price-breakup-details"'));
      assert.ok(content.includes('role="region"'));
    });

    it('verifies carrier badge is updated to BVC Armored Transit', () => {
      assert.ok(!content.includes('SHIPROCKET DELIVERY'));
      assert.ok(content.includes('BVC ARMORED TRANSIT'));
    });
  });
});
