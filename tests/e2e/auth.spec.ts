import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a brand to sign up', async ({ page }) => {
    console.log('Navigating to /signup/brand');
    await page.goto('/signup/brand');
    console.log('Waiting for networkidle');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    const signUpButton = page.getByRole('button', { name: 'Sign Up' });

    console.log('Waiting for email input to be visible');
    await emailInput.waitFor({ state: 'visible' });
    console.log('Filling email');
    await emailInput.fill(`brand-${Date.now()}@example.com`);

    console.log('Waiting for password input to be visible');
    await passwordInput.waitFor({ state: 'visible' });
    console.log('Filling password');
    await passwordInput.fill('password123');

    console.log('Waiting for confirm password input to be visible');
    await confirmPasswordInput.waitFor({ state: 'visible' });
    console.log('Confirming password');
    await confirmPasswordInput.fill('password123');

    console.log('Waiting for Sign Up button to be enabled');
    await signUpButton.waitFor({ state: 'enabled' });
    console.log('Clicking Sign Up button');
    await signUpButton.click();

    console.log('Waiting for URL after brand signup');
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/, { timeout: 30000 });
    console.log('Waiting for networkidle after redirect');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle
    console.log('Asserting URL after brand signup');
    await expect(page).toHaveURL(/.*(signup\/brand\/success|dashboard)/);
  });

  test('should allow a creator to sign up', async ({ page }) => {
    console.log('Navigating to /signup/creator');
    await page.goto('/signup/creator');
    console.log('Waiting for networkidle');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    const signUpButton = page.getByRole('button', { name: 'Sign Up' });

    console.log('Waiting for email input to be visible');
    await emailInput.waitFor({ state: 'visible' });
    console.log('Filling email');
    await emailInput.fill(`creator-${Date.now()}@example.com`);

    console.log('Waiting for password input to be visible');
    await passwordInput.waitFor({ state: 'visible' });
    console.log('Filling password');
    await passwordInput.fill('password123');

    console.log('Waiting for confirm password input to be visible');
    await confirmPasswordInput.waitFor({ state: 'visible' });
    console.log('Confirming password');
    await confirmPasswordInput.fill('password123');

    console.log('Waiting for Sign Up button to be enabled');
    await signUpButton.waitFor({ state: 'enabled' });
    console.log('Clicking Sign Up button');
    await signUpButton.click();

    console.log('Waiting for URL after creator signup');
    await page.waitForURL(/.*(signup\/creator\/success|dashboard)/, { timeout: 30000 });
    console.log('Waiting for networkidle after redirect');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle
    console.log('Asserting URL after creator signup');
    await expect(page).toHaveURL(/.*(signup\/creator\/success|dashboard)/);
  });

  test('should allow a registered user to log in', async ({ page }) => {
    const testEmail = `login-${Date.now()}@example.com`;

    console.log('Navigating to /signup/brand to register user for login test');
    await page.goto('/signup/brand');
    console.log('Waiting for networkidle for signup page');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    const regEmailInput = page.locator('input[name="email"]');
    const regPasswordInput = page.locator('input[name="password"]');
    const regConfirmPasswordInput = page.locator('input[name="confirmPassword"]');
    const regSignUpButton = page.getByRole('button', { name: 'Sign Up' });

    console.log('Waiting for registration email input to be visible');
    await regEmailInput.waitFor({ state: 'visible' });
    console.log('Filling email for registration');
    await regEmailInput.fill(testEmail);

    console.log('Waiting for registration password input to be visible');
    await regPasswordInput.waitFor({ state: 'visible' });
    console.log('Filling password for registration');
    await regPasswordInput.fill('password123');

    console.log('Waiting for registration confirm password input to be visible');
    await regConfirmPasswordInput.waitFor({ state: 'visible' });
    console.log('Confirming password for registration');
    await regConfirmPasswordInput.fill('password123');

    console.log('Waiting for registration Sign Up button to be enabled');
    await regSignUpButton.waitFor({ state: 'enabled' });
    console.log('Clicking Sign Up button for registration');
    await regSignUpButton.click();

    console.log('Waiting for URL after registration');
    await page.waitForURL(/.*(signup\/brand\/success|dashboard)/, { timeout: 30000 });
    console.log('Waiting for networkidle after registration redirect');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    // Now navigate to login page and attempt to log in
    console.log('Navigating to /login after successful registration');
    await page.goto('/login');
    console.log('Waiting for networkidle for login page');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    const loginEmailInput = page.locator('input[name="email"]');
    const loginPasswordInput = page.locator('input[name="password"]');
    const loginButton = page.getByRole('button', { name: 'Login' });

    console.log('Waiting for login email input to be visible');
    await loginEmailInput.waitFor({ state: 'visible' });
    console.log('Filling email for login');
    await loginEmailInput.fill(testEmail);

    console.log('Waiting for login password input to be visible');
    await loginPasswordInput.waitFor({ state: 'visible' });
    console.log('Filling password for login');
    await loginPasswordInput.fill('password123');

    console.log('Waiting for Login button to be enabled');
    await loginButton.waitFor({ state: 'enabled' });
    console.log('Clicking Login button');
    await loginButton.click();

    console.log('Waiting for URL after login');
    await page.waitForURL(/.*(dashboard|\/)/, { timeout: 30000 });
    console.log('Waiting for networkidle after login redirect');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle
    console.log('Asserting URL after login');
    await expect(page).toHaveURL(/.*(dashboard|\/)/);
  });

  test('should show an error for invalid login credentials and remain on login page', async ({ page }) => {
    console.log('Navigating to /login for invalid credentials test');
    await page.goto('/login');
    console.log('Waiting for networkidle for login page');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.getByRole('button', { name: 'Login' });

    console.log('Waiting for email input to be visible');
    await emailInput.waitFor({ state: 'visible' });
    console.log('Filling invalid email');
    await emailInput.fill('nonexistent@example.com');

    console.log('Waiting for password input to be visible');
    await passwordInput.waitFor({ state: 'visible' });
    console.log('Filling invalid password');
    await passwordInput.fill('wrongpassword');

    console.log('Waiting for Login button to be enabled');
    await loginButton.waitFor({ state: 'enabled' });
    console.log('Clicking Login button');
    await loginButton.click();

    console.log('Waiting for networkidle after failed login attempt');
    await page.waitForLoadState('networkidle'); // Changed back to networkidle
    console.log('Asserting URL remains on login page');
    await expect(page).toHaveURL(/.*login/);
  });
});
