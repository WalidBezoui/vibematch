import { test, expect } from '@playwright/test';

test.describe('Jobs', () => {
  test('should display the jobs page', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveTitle(/Jobs/);
  });
});
