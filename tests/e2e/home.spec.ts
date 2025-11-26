import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  // Removed test.setTimeout as global timeout is configured in playwright.config.ts

  test('should display the VibeMatch logo or title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/VibeMatch/);

    // Expect a specific text to be visible on the page, indicating the app loaded.
    await expect(page.getByRole('heading', { name: 'VibeMatch' })).toBeVisible();
  });

  test('should have a working "Learn more" link on the hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Click the "Learn more" button in the hero section
    await page.getByRole('link', { name: 'Learn more' }).click();
    
    // Expect to be navigated to the /faq page
    await expect(page).toHaveURL(/.*faq/);
    // Expect the FAQ page title to be visible
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
  });
});
