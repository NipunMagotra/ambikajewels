import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test.describe('Automated Accessibility Testing with axe-core (WCAG 2.1 AA)', () => {

  const auditResults: Record<string, any> = {};

  test('Homepage WCAG 2.1 AA automated audit', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    auditResults['homepage'] = {
      url: '/',
      violationsCount: results.violations.length,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length
      }))
    };

    console.log(`Homepage accessibility violations: ${results.violations.length}`);
    // Log any critical or serious violations
    const serious = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(serious.length).toBeLessThanOrEqual(2);
  });

  test('Product Details Page WCAG 2.1 AA automated audit', async ({ page }) => {
    await page.goto('/collections/authentic-22k-dogri-jhumki');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    auditResults['product_detail'] = {
      url: '/collections/authentic-22k-dogri-jhumki',
      violationsCount: results.violations.length,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length
      }))
    };

    console.log(`Product Detail accessibility violations: ${results.violations.length}`);
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical.length).toBe(0);
  });

  test('Shopping Cart WCAG 2.1 AA automated audit', async ({ page }) => {
    await page.goto('/cart');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    auditResults['cart'] = {
      url: '/cart',
      violationsCount: results.violations.length,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodesCount: v.nodes.length
      }))
    };

    console.log(`Cart accessibility violations: ${results.violations.length}`);
  });

  test('Save axe-core accessibility audit report', async () => {
    const reportPath = path.resolve('docs/audit/accessibility-axe-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
    console.log(`Axe-core accessibility report saved to: ${reportPath}`);
    expect(fs.existsSync(reportPath)).toBe(true);
  });

});
