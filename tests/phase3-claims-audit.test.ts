import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 3 Item 7: Claims Audit & Qualification with Stated Terms', () => {
  it('ensures TrustBadges and Testimonials qualify certified diamond claims with laboratory standards', () => {
    const trustBadges = fs.readFileSync(path.join(process.cwd(), 'src/components/home/TrustBadges.tsx'), 'utf-8');
    assert.ok(trustBadges.includes('GIA / IGI CERTIFIED DIAMONDS'));

    const testimonials = fs.readFileSync(path.join(process.cwd(), 'src/components/home/TestimonialsSection.tsx'), 'utf-8');
    assert.ok(testimonials.includes('BIS ASSAYED & HALLMARKED'));
    assert.ok(!testimonials.includes('GOVERNMENT CERTIFIED GOLD'));
    assert.ok(testimonials.includes('Laboratory-Certified Diamonds'));
    assert.ok(!testimonials.includes('Dispatched through Shiprocket'));
    assert.ok(testimonials.includes('BVC Logistics'));
  });

  it('ensures ThermalReceiptModal does not make unbacked 100% absolute guarantee claims', () => {
    const thermalReceipt = fs.readFileSync(path.join(process.cwd(), 'src/components/counter/ThermalReceiptModal.tsx'), 'utf-8');
    assert.ok(!thermalReceipt.includes('100% BIS Hallmarked Gold Guarantee'));
    assert.ok(thermalReceipt.includes('BIS Hallmarked Gold as per Applicable Purity'));
  });

  it('ensures storeKnowledge qualifies gold exchange and lifetime claims with stated policy terms', () => {
    const storeKnowledge = fs.readFileSync(path.join(process.cwd(), 'src/data/storeKnowledge.ts'), 'utf-8');
    assert.ok(!storeKnowledge.includes('"100% gold exchange and custom redesign policy."'));
    assert.ok(storeKnowledge.includes('Transparent gold exchange and custom redesign policy based on XRF purity testing'));
    assert.ok(storeKnowledge.includes('Lifetime buyback & exchange options (as per stated terms in Exchange Policy)'));
  });

  it('ensures services and about pages do not contain unbacked 100% exchange claims', () => {
    const services = fs.readFileSync(path.join(process.cwd(), 'src/app/services/page.tsx'), 'utf-8');
    assert.ok(!services.includes('100% Gold Exchange'));
    assert.ok(services.includes('transparent Gold Exchange (as per stated terms)'));

    const about = fs.readFileSync(path.join(process.cwd(), 'src/app/about/page.tsx'), 'utf-8');
    assert.ok(!about.includes('100% transparent gold exchange'));
    assert.ok(about.includes('Transparent gold exchange as per stated store terms'));
  });

  it('ensures ProductDetailClient references Bureau of Indian Standards rather than Govt of India', () => {
    const pdp = fs.readFileSync(path.join(process.cwd(), 'src/components/catalog/ProductDetailClient.tsx'), 'utf-8');
    assert.ok(!pdp.includes('BIS HALLMARKED (GOVT OF INDIA)'));
    assert.ok(pdp.includes('BIS HALLMARKED (BUREAU OF INDIAN STANDARDS)'));
    assert.ok(!pdp.includes("'Govt of India BIS Hallmarked'"));
  });
});
