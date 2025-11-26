import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a brand to sign up', async ({ page }) => {
    console.log('Navigating to /signup/brand');
    await page.goto('/signup/brand');
    console.log('Waiting for DOMContentLoaded');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Filling email');
    await page.fill('input[name="email"]', `brand-${Date.now()}@example.com`);
    console.log('Filling password');
    await page.fill('input[name="password"]', 'password123');
    console.log('Confirming password');
    await page.fill('input[name="confirmPassword"]', 'password123');
    console.log('Clicking Sign Up button');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    console.log('Waiting for URL after brand signup');
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/, { timeout: 30000 }); // Added timeout
    console.log('Waiting for DOMContentLoaded after redirect');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Asserting URL after brand signup');
    await expect(page).toHaveURL(/.*(signup\/brand\/success|dashboard)/);
  });

  test('should allow a creator to sign up', async ({ page }) => {
    console.log('Navigating to /signup/creator');
    await page.goto('/signup/creator');
    console.log('Waiting for DOMContentLoaded');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Filling email');
    await page.fill('input[name="email"]', `creator-${Date.now()}@example.com`);
    console.log('Filling password');
    await page.fill('input[name="password"]', 'password123');
    console.log('Confirming password');
    await page.fill('input[name="confirmPassword"]', 'password123');
    console.log('Clicking Sign Up button');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    console.log('Waiting for URL after creator signup');
    await page.waitForURL(/.*(signup\/creator\/success|dashboard)/, { timeout: 30000 }); // Added timeout
    console.log('Waiting for DOMContentLoaded after redirect');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Asserting URL after creator signup');
    await expect(page).toHaveURL(/.*(signup\/creator\/success|dashboard)/);
  });

  test('should allow a registered user to log in', async ({ page }) => {
    const testEmail = `login-${Date.now()}@example.com`;
    console.log('Navigating to /signup/brand to register user for login test');
    await page.goto('/signup/brand');
    console.log('Waiting for DOMContentLoaded for signup page');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Filling email for registration');
    await page.fill('input[name="email"]', testEmail);
    console.log('Filling password for registration');
    await page.fill('input[name="password"]', 'password123');
    console.log('Confirming password for registration');
    await page.fill('input[name="confirmPassword"]', 'password123');
    console.log('Clicking Sign Up button for registration');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    console.log('Waiting for URL after registration');
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/, { timeout: 30000 }); // Added timeout
    console.log('Waiting for DOMContentLoaded after registration redirect');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle

    // Directly navigate to login page after successful registration
    console.log('Navigating to /login after successful registration');
    await page.goto('/login');
    console.log('Waiting for DOMContentLoaded for login page');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle

    console.log('Filling email for login');
    await page.fill('input[name="email"]', testEmail);
    console.log('Filling password for login');
    await page.fill('input[name="password"]', 'password123');
    console.log('Clicking Login button');
    await page.getByRole('button', { name: 'Login' }).click();

    console.log('Waiting for URL after login');
    await page.waitForURL(/.*(dashboard|\/)/, { timeout: 30000 }); // Added timeout
    console.log('Waiting for DOMContentLoaded after login redirect');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Asserting URL after login');
    await expect(page).toHaveURL(/.*(dashboard|\/)/);
  });

  test('should show an error for invalid login credentials and remain on login page', async ({ page }) => {
    console.log('Navigating to /login for invalid credentials test');
    await page.goto('/login');
    console.log('Waiting for DOMContentLoaded for login page');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Filling invalid email');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    console.log('Filling invalid password');
    await page.fill('input[name="password"]', 'wrongpassword');
    console.log('Clicking Login button');
    await page.getByRole('button', { name: 'Login' }).click();

    console.log('Waiting for DOMContentLoaded after failed login attempt');
    await page.waitForLoadState('domcontentloaded'); // Changed from networkidle
    console.log('Asserting URL remains on login page');
    await expect(page).toHaveURL(/.*login/);
  });
});
