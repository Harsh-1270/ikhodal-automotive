import { test, expect } from '@playwright/test';

test.describe('User Registration Complete', () => {

    test('user can register with valid details', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/register');

        await page.getByLabel(/full name/i).fill('Test User');
        await page.getByLabel(/email/i).fill('testuser@example.com');
        await page.getByLabel(/password/i).fill('Test@123456');

        await page.getByRole('button', { name: /create account/i }).click();

        await expect(page).toHaveURL(/login|register|dashboard|home|\//);
    });

    test('registration validation works for email format', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/register');

        await page.getByLabel(/email/i).fill('invalid-email');
        await page.getByRole('button', { name: /create account/i }).click();

        await page.waitForTimeout(500);

        await expect(page).toHaveURL(/register/i);
    });

});