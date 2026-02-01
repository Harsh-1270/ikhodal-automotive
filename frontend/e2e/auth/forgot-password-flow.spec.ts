import { test, expect } from '@playwright/test';

test.describe('Forgot Password Flow', () => {

    test('forgot password page loads', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/forgot-password');

        await expect(
            page.getByRole('heading', { name: /Forgot Password\?/i })
        ).toBeVisible();
    });

    test('email validation shows error on invalid email', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/forgot-password');

        // Type invalid email
        await page.getByPlaceholder(/you@example.com/i).fill('invalidemail');

        // Click Continue
        await page.getByRole('button', { name: /Continue/i }).click();

        // Error alert visible
        await expect(
            page.locator('.error-alert')
        ).toBeVisible();
    });

    test('valid email moves to OTP step', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/forgot-password');

        await page.getByPlaceholder(/you@example.com/i).fill('test@example.com');
        await page.getByRole('button', { name: /Continue/i }).click();

        // Component has 1200ms setTimeout before step change
        await page.waitForTimeout(1500);

        await expect(
            page.getByRole('heading', { name: /Verify Your Email/i })
        ).toBeVisible();
    });

    test('valid OTP moves to reset password step', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/forgot-password');

        // Step 1 — submit valid email
        await page.getByPlaceholder(/you@example.com/i).fill('test@example.com');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Step 2 — enter mock OTP 123456
        await page.locator('#otp-0').fill('1');
        await page.locator('#otp-1').fill('2');
        await page.locator('#otp-2').fill('3');
        await page.locator('#otp-3').fill('4');
        await page.locator('#otp-4').fill('5');
        await page.locator('#otp-5').fill('6');

        await page.getByRole('button', { name: /Verify Code/i }).click();
        await page.waitForTimeout(1500);

        await expect(
            page.getByRole('heading', { name: /Create New Password/i })
        ).toBeVisible();
    });

    test('password reset completes full flow to success', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/forgot-password');

        // Step 1
        await page.getByPlaceholder(/you@example.com/i).fill('test@example.com');
        await page.getByRole('button', { name: /Continue/i }).click();
        await page.waitForTimeout(1500);

        // Step 2
        await page.locator('#otp-0').fill('1');
        await page.locator('#otp-1').fill('2');
        await page.locator('#otp-2').fill('3');
        await page.locator('#otp-3').fill('4');
        await page.locator('#otp-4').fill('5');
        await page.locator('#otp-5').fill('6');

        await page.getByRole('button', { name: /Verify Code/i }).click();
        await page.waitForTimeout(1500);

        // Step 3 — fill matching passwords (min 8 chars)
        const passwordInputs = page.locator('input[type="password"]');
        await passwordInputs.nth(0).fill('NewPass123');
        await passwordInputs.nth(1).fill('NewPass123');

        await page.getByRole('button', { name: /Reset Password/i }).click();
        await page.waitForTimeout(1500);

        // Step 4 — success
        await expect(
            page.getByRole('heading', { name: /Password Reset Successful/i })
        ).toBeVisible();
        await expect(
            page.getByText(/Go to Login/i)
        ).toBeVisible();
    });

});
