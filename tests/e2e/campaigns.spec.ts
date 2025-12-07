import { test, expect } from '@playwright/test';

test.describe('Campaigns', () => {
  test('should display the campaigns page', async ({ page }) => {
    await page.goto('/campaigns');
    await expect(page).toHaveTitle(/Campaigns/);
  });
});
