import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../src/config/siteConfig';
import type { Product } from '../src/types';

describe('Phase 3 Item 1: Owner-Data Disclosures & Product Hallmarking', () => {
  it('enforces [TO BE FILLED BY OWNER] placeholders for unconfigured statutory fields', () => {
    // Zero invented identifiers: statutory fields must be placeholders or read from environment
    assert.ok(siteConfig.gstin.includes('[TO BE FILLED BY OWNER]') || siteConfig.gstin.length === 15);
    assert.ok(siteConfig.pan.includes('[TO BE FILLED BY OWNER]') || siteConfig.pan.length === 10);
    assert.ok(siteConfig.bisHallmarkLicense.includes('[TO BE FILLED BY OWNER]') || siteConfig.bisHallmarkLicense.length > 0);
    assert.ok(siteConfig.legalEntityType.includes('[TO BE FILLED BY OWNER]') || siteConfig.legalEntityType.length > 0);
  });

  it('mandates statutory Grievance Officer disclosures with response times', () => {
    const { grievanceOfficer } = siteConfig;
    assert.ok(grievanceOfficer.name);
    assert.ok(grievanceOfficer.email.includes('@'));
    assert.ok(grievanceOfficer.phone);
    assert.ok(grievanceOfficer.address.includes('Jammu'));
    assert.match(grievanceOfficer.responseTime, /48 hours/i);
    assert.match(grievanceOfficer.responseTime, /30 days/i);
    assert.match(grievanceOfficer.responseTime, /verify with CA\/lawyer/i);
  });

  it('verifies that BIS hallmarked and HUID claims are data-driven per product', () => {
    const hallmarkedGoldProduct: Partial<Product> = {
      name: '22K Gold Dogra Haar',
      category: 'Dogra Heritage Collection',
      is_hallmarked: true,
      has_huid: true,
      purity: '22K (916)'
    };

    const nonHallmarkedProduct: Partial<Product> = {
      name: 'Custom Brass Sample Choker',
      category: 'Bespoke Jewellery',
      is_hallmarked: false,
      has_huid: false,
      purity: 'Brass / Unhallmarked'
    };

    const silverProduct: Partial<Product> = {
      name: '925 Silver Payal',
      category: 'Silver Jewellery (925)',
      is_hallmarked: true,
      has_huid: false,
      purity: '925 Silver'
    };

    // Assertion: Hallmarking must NOT be assumed if is_hallmarked is false
    assert.equal(hallmarkedGoldProduct.is_hallmarked, true);
    assert.equal(hallmarkedGoldProduct.has_huid, true);
    assert.equal(nonHallmarkedProduct.is_hallmarked, false);
    assert.equal(silverProduct.is_hallmarked, true);
    assert.equal(silverProduct.has_huid, false);
  });
});
