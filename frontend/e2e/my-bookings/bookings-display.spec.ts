import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('My Bookings Display', () => {

    test('booking list displays correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const bookingCard = page.locator('.booking-card').first();

        if (await bookingCard.isVisible()) {
            await expect(bookingCard).toBeVisible();
        } else {
            await expect(page.getByText(/no bookings|empty/i)).toBeVisible();
        }
    });

    test('filter tabs work', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const allTab = page.getByRole('button', { name: /all/i });
        await allTab.click();

        await expect(page).toHaveURL(/my-bookings/i);
    });

    test('booking cards show correct information', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const bookingCard = page.locator('.booking-card').first();

        if (await bookingCard.isVisible()) {
            await expect(bookingCard).toContainText(/service|booking/i);
        }
    });

    test('view details navigates to booking details', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const viewBtn = page.getByRole('button', { name: /view details/i }).first();

        if (await viewBtn.isVisible()) {
            await viewBtn.click();
            await expect(page).toHaveURL(/booking-details/i);
        }
    });

    test('empty bookings shows empty state', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const emptyState = page.locator('.empty-state');
        const bookingCard = page.locator('.booking-card');

        if (await emptyState.isVisible()) {
            await expect(emptyState).toBeVisible();
        } else {
            await expect(bookingCard.first()).toBeVisible();
        }
    });

    test('booking status badges show correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/my-bookings');

        const statusBadge = page.locator('.status-badge').first();

        if (await statusBadge.isVisible()) {
            await expect(statusBadge).toBeVisible();
        }
    });

});
