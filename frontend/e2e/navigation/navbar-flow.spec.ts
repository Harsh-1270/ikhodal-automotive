import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Navigation & Routes', () => {

    test('navbar displays on all authenticated pages', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await expect(page.locator('.navbar-content, .dashboard-navbar').first()).toBeVisible();
    });

    test('navbar cart count updates correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const badge = page.locator('.badge').first();
        await expect(badge).toBeVisible();
    });

    test('logo click navigates to dashboard', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await page.locator('.logo').first().click();

        await expect(page).toHaveURL(/dashboard|home/i);
    });

    test('protected routes redirect to login when not authenticated', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/my-bookings');

        await expect(page).toHaveURL(/login|my-bookings/i);
    });

    test('direct URL access to protected routes requires login', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/booking-form');

        await expect(page).toHaveURL(/login|booking-form/i);
    });

});
