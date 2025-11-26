import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the VibeMatch logo or title', async ({ page }) => {
    console.log('Navigating to homepage');
    await page.goto('/');
    console.log('Waiting for networkidle');
    await page.waitForLoadState('networkidle');

    const vibeMatchHeading = page.getByRole('heading', { name: 'VibeMatch' });

    console.log('Waiting for VibeMatch heading to be visible');
    await vibeMatchHeading.waitFor({ state: 'visible' });

    console.log('Asserting page title');
    await expect(page).toHaveTitle(/VibeMatch/); // Expect a title "to contain" a substring.

    console.log('Asserting VibeMatch heading is visible');
    await expect(vibeMatchHeading).toBeVisible(); // Expect a specific text to be visible on the page, indicating the app loaded.
  });

  test('should have a working "Learn more" link on the hero section', async ({ page }) => {
    console.log('Navigating to homepage for Learn more link test');
    await page.goto('/');
    console.log('Waiting for networkidle');
    await page.waitForLoadState('networkidle');

    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    const faqHeading = page.getByRole('heading', { name: 'Frequently Asked Questions' });

    console.log('Waiting for "Learn more" link to be visible and enabled');
    await learnMoreLink.waitFor({ state: 'visible' });
    await learnMoreLink.waitFor({ state: 'enabled' });

    console.log('Clicking "Learn more" link');
    await learnMoreLink.click();
    
    console.log('Waiting for URL after clicking "Learn more"');
    await page.waitForURL(/.*faq/, { timeout: 30000 });
    console.log('Asserting URL is /faq');
    await expect(page).toHaveURL(/.*faq/);

    console.log('Waiting for FAQ page heading to be visible');
    await faqHeading.waitFor({ state: 'visible' });
    console.log('Asserting FAQ page heading is visible');
    await expect(faqHeading).toBeVisible();
  });
});
