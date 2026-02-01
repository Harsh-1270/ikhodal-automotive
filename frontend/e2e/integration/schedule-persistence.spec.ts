import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Schedule Selection Persistence', () => {

    test('selected date persists after selecting time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        const availableDay = page.locator('.calendar-day.available').first();
        await availableDay.click();

        const selectedDate = page.locator('.calendar-day.selected');
        await expect(selectedDate).toBeVisible();

        const availableSlot = page.locator('.time-slot').filter({ hasNot: page.locator('.booked-badge') }).first();
        if (await availableSlot.isVisible()) {
            await availableSlot.click();
        }

        await expect(selectedDate).toBeVisible();
    });

});