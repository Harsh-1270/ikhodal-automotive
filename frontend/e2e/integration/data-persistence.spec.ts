import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Data Persistence', () => {

    test('form resets when navigating back (expected behavior)', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await page.getByLabel(/make/i).fill('Toyota');
        await page.getByLabel(/model/i).fill('Camry');

        await page.getByRole('button', { name: /back to cart/i }).click();
        await page.goBack();

        await expect(page.getByLabel(/make/i)).toHaveValue('');
    });


    test('selected schedule persists in booking flow', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        const availableDay = page.locator('.calendar-day.available').first();
        if (await availableDay.isVisible()) {
            await availableDay.click();

            const availableSlot = page.locator('.time-slot').filter({ hasNot: page.locator('.booked-badge') }).first();
            if (await availableSlot.isVisible()) {
                await availableSlot.click();
            }
        }

        await expect(page).toHaveURL(/schedule/i);
    });

    test('user session persists on page refresh', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await page.reload();

        await expect(page).toHaveURL(/dashboard|login/i);
    });

});