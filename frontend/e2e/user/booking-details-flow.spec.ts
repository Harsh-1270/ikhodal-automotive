import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Booking Details', () => {

    test('booking details page loads with ID', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        await expect(
            page.getByRole('heading', { name: /booking details/i })
        ).toBeVisible();
    });

    test('service information displays correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        await expect(
            page.getByRole('heading', { name: /service information/i })
        ).toBeVisible();
    });

    test('booking timeline shows correct status', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        await expect(
            page.locator('.status-badge-large').first()
        ).toBeVisible();
    });

    test('customer information is visible', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        await expect(
            page.getByRole('heading', { name: /customer information/i })
        ).toBeVisible();
    });

    test('payment details are visible', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        await expect(
            page.getByRole('heading', { name: /payment summary/i })
        ).toBeVisible();
    });

    test('action buttons work correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-details/BK001');

        const backBtn = page.getByRole('button', { name: /back to my bookings/i });
        await expect(backBtn).toBeVisible();
    });

});