import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Booking Form Optional Fields', () => {

    test('optional fields do not show errors when empty', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await page.getByLabel(/make/i).fill('Toyota');
        await page.getByLabel(/model/i).fill('Camry');
        await page.getByLabel(/year/i).fill('2020');
        await page.getByLabel(/full name/i).fill('John Doe');
        await page.getByLabel(/address/i).fill('123 Main St');
        await page.getByLabel(/postcode/i).fill('380001');

        await page.getByRole('button', { name: /continue to payment/i }).click();

        await expect(page).toHaveURL(/payment/i);
    });

    test('make and model validation works', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await page.getByRole('button', { name: /continue to payment/i }).click();

        await expect(
            page.locator('.error-text').filter({ hasText: /make/i })
        ).toBeVisible();
    });


    test('form submission blocked with invalid data', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await page.getByRole('button', { name: /continue to payment/i }).click();

        await expect(page).toHaveURL(/booking-form/i);
    });

});