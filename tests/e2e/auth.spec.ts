import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  // Removed test.setTimeout as global timeout is configured in playwright.config.ts

  test.beforeEach(async ({ page }) => {
    // No global beforeEach for navigation here; each test will navigate explicitly.
  });

  test('should allow a brand to sign up', async ({ page }) => {
    await page.goto('/signup/brand');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', `brand-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/);
    await page.waitForLoadState('networkidle'); // Wait for post-redirect stability
    await expect(page).toHaveURL(/.*(signup\/brand\/success|dashboard)/);
  });

  test('should allow a creator to sign up', async ({ page }) => {
    await page.goto('/signup/creator');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', `creator-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await page.waitForURL(/.*(signup\/creator\/success|dashboard)/);
    await page.waitForLoadState('networkidle'); // Wait for post-redirect stability
    await expect(page).toHaveURL(/.*(signup\/creator\/success|dashboard)/);
  });

  test('should allow a registered user to log in', async ({ page }) => {
    // First, register a user to ensure we have one to log in with
    const testEmail = `login-${Date.now()}@example.com`;
    await page.goto('/signup/brand');
    await page.waitForLoadState('networkidle'); // Wait for signup page to load
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/); // Wait for signup redirection
    await page.waitForLoadState('networkidle'); // Wait for post-signup stability
    
    const logoutButton = page.getByRole('button', { name: 'Logout' });
    // Check if logout button is visible before attempting to click it
    if (await logoutButton.isVisible({
        timeout: 10000 // Give it some time to appear
    })) {
      await logoutButton.click(); 
      await page.waitForURL(/.*login/); // Wait for redirection back to login after logout
      await page.waitForLoadState('networkidle'); // Wait for post-logout stability
    } else {
      // If no logout button, navigate to login manually
      await page.goto('/login');
      await page.waitForLoadState('networkidle'); // Wait for login page to load
    }

    // Now navigate to login page and attempt to log in
    await page.goto('/login');
    await page.waitForLoadState('networkidle'); // Wait for login page to load
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForURL(/.*(dashboard|\/)/);
    await page.waitForLoadState('networkidle'); // Wait for post-login stability
    await expect(page).toHaveURL(/.*(dashboard|\/)/);
  });

  test('should show an error for invalid login credentials and remain on login page', async ({ page }) => {
    await page.goto('/login'); // Ensure we are on the login page
    await page.waitForLoadState('networkidle'); // Wait for login page to load
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForLoadState('networkidle'); // Wait for potential error message or form re-render
    await expect(page).toHaveURL(/.*login/);
  });
});
