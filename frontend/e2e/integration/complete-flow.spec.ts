import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Integration & Complete Flow', () => {

    test('complete booking flow: Dashboard → Cart → Schedule → Form → Payment', async ({ page }) => {
        await loginAsUser(page);

        // Dashboard
        await page.goto('http://127.0.0.1:3000/dashboard');
        await expect(page).toHaveURL(/dashboard/i);

        // Cart
        await page.goto('http://127.0.0.1:3000/cart');
        await expect(page).toHaveURL(/cart/i);

        // Schedule
        await page.getByRole('button', { name: /schedule/i }).click();
        await expect(page).toHaveURL(/schedule/i);

        // Select date and time
        const availableDay = page.locator('.calendar-day.available').first();
        await availableDay.click();

        const availableSlot = page.locator('.time-slot').filter({ hasNot: page.locator('.booked-badge') }).first();
        await availableSlot.click();

        await page.getByRole('button', { name: /continue/i }).click();

        // Booking Form
        await expect(page).toHaveURL(/booking-form/i);

        await page.getByLabel(/make/i).fill('Toyota');
        await page.getByLabel(/model/i).fill('Camry');
        await page.getByLabel(/year/i).fill('2020');
        await page.getByLabel(/full name/i).fill('John Doe');
        await page.getByLabel(/address/i).fill('123 Main St');
        await page.getByLabel(/postcode/i).fill('380001');

        await page.getByRole('button', { name: /continue to payment/i }).click();

        // Payment
        await expect(page).toHaveURL(/payment/i);
    });

    test('cart persists data across pages', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        const itemCount = await page.locator('.cart-item').count();

        await page.goto('http://127.0.0.1:3000/dashboard');
        await page.goto('http://127.0.0.1:3000/cart');

        await expect(page.locator('.cart-item')).toHaveCount(itemCount);
    });

});
