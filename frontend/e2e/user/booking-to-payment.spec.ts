import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Booking → Payment Flow', () => {

    test('continue button is hidden before selecting time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        await page.locator('.calendar-day.available').first().click();

        await expect(
            page.getByRole('button', { name: /continue to booking/i })
        ).toHaveCount(0);
    });

    test('selection summary appears after selecting time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        await page.locator('.calendar-day.available').first().click();
        await page.locator('.time-slot:not(.booked)').first().click();

        await expect(
            page.locator('.selection-summary')
        ).toBeVisible();
    });

    test('summary shows selected date and time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        await page.locator('.calendar-day.available').first().click();
        await page.locator('.time-slot:not(.booked)').first().click();

        await expect(page.getByText(/date:/i)).toBeVisible();
        await expect(page.getByText(/time:/i)).toBeVisible();
    });

    test('user cannot proceed without date and time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        await expect(
            page.getByRole('button', { name: /continue to booking/i })
        ).toHaveCount(0);
    });

    test('user reaches booking form after continue', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        await page.locator('.calendar-day.available').first().click();
        await page.locator('.time-slot:not(.booked)').first().click();

        await page.getByRole('button', { name: /continue to booking/i }).click();

        await expect(page).toHaveURL(/booking-form/i);
    });

    test('booking form page loads correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await expect(
            page.getByRole('heading', { name: /booking details/i })
        ).toBeVisible();
    });

});
