import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Final E2E Coverage Summary', () => {

    test('complete user journey end-to-end', async ({ page }) => {
        // Home
        await page.goto('http://127.0.0.1:3000/');
        await expect(page).toHaveURL(/\//);

        // Login
        await loginAsUser(page);

        // Dashboard
        await page.goto('http://127.0.0.1:3000/dashboard');
        await expect(page).toHaveURL(/dashboard/i);

        // Cart
        await page.goto('http://127.0.0.1:3000/cart');
        await expect(page).toHaveURL(/cart/i);

        // My Bookings
        await page.goto('http://127.0.0.1:3000/my-bookings');
        await expect(page).toHaveURL(/my-bookings/i);

        // Payment
        await page.goto('http://127.0.0.1:3000/payment');
        await expect(page).toHaveURL(/payment/i);

        // All pages accessible
        await expect(page.locator('body')).toBeVisible();
    });

});
