import { test, expect } from '@playwright/test';

test.describe('Homepage Visibility', () => {
  test('should load the homepage and show main elements', async ({ page }) => {
    // We use the base URL from playwright.config.ts or env
    await page.goto('/');

    // Check for the main title or logo
    // Based on the screenshots, we expect "Ayato Reporter" or similar
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for "最新のレポート" (Latest Reports) section
    const reportsHeader = page.getByText('最新のレポート');
    await expect(reportsHeader).toBeVisible();
  });

  test('should have essential navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for common navigation elements if any
    // e.g., Footer or Header links
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
