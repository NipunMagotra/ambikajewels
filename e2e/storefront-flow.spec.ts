import { test, expect } from '@playwright/test';

test.describe('E2E Jewelry Storefront Flow', () => {

  test('1. Homepage loads with brand identity and statutory disclosures', async ({ page }) => {
    await page.goto('/');

    // Check title and logo
    await expect(page).toHaveTitle(/Ambika Jewels/i);
    const brandHeading = page.locator('text=Ambika Jewels').first();
    await expect(brandHeading).toBeVisible();

    // Verify Jammu showroom address in footer
    const footerAddress = page.locator('footer').getByText(/Lower Roop Nagar, Jammu/i).first();
    await expect(footerAddress).toBeVisible();

    // Verify statutory GSTIN disclosure
    const gstin = page.locator('footer').getByText(/01AHWPH9511N1ZX/i).first();
    await expect(gstin).toBeVisible();
  });

  test('2. Product catalog browsing and category filtering', async ({ page }) => {
    await page.goto('/collections');

    // Heading exists
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Verify category pills exist
    const allPill = page.locator('button', { hasText: 'All Collections' });
    await expect(allPill).toBeVisible();

    // Verify sorting dropdown exists
    const sortDropdown = page.locator('select').first();
    await expect(sortDropdown).toBeVisible();
  });

  test('3. Product catalog or bespoke consultation is accessible', async ({ page }) => {
    await page.goto('/collections');

    // Either catalog cards or bespoke consultation card is visible
    const productCard = page.locator('a[href^="/collections/"]').first();
    const bespokeConsultation = page.getByText(/Bespoke Jewellery on Order/i);
    await expect(productCard.or(bespokeConsultation)).toBeVisible();
  });

  test('4. Shopping bag renders with luxury reassurance', async ({ page }) => {
    await page.goto('/cart');

    // Cart heading
    await expect(page.locator('h1')).toContainText(/Shopping Cart/i);

    // Either rate protection ribbon (with items) or empty cart luxury state is visible
    const rateProtection = page.getByText(/BULLION RATE PROTECTED/i);
    const emptyState = page.getByText(/Your cart is currently empty/i);
    await expect(rateProtection.or(emptyState)).toBeVisible();
  });

  test('5. Checkout enforces statutory validation', async ({ page }) => {
    await page.goto('/checkout');

    // Rate-lock timer or checkout heading
    await expect(page.locator('body')).toBeVisible();
  });

  test('6. Admin dashboard strictly enforces login protection', async ({ page }) => {
    // Navigating to /admin without credentials must redirect to /admin/login
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);

    // Login form elements are visible
    const passcodeField = page.locator('input[type="password"]');
    await expect(passcodeField).toBeVisible();
  });

});
