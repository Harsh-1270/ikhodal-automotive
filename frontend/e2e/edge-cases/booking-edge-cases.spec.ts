import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Booking Flow Edge Cases', () => {

    test('cannot book without selecting both date and time', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/schedule');

        const availableDay = page.locator('.calendar-day.available').first();
        await availableDay.click();

        const continueBtn = page.getByRole('button', { name: /continue/i });

        if (await continueBtn.isVisible()) {
            await expect(continueBtn).toBeDisabled();
        } else {
            await expect(continueBtn).not.toBeVisible();
        }
    });

});
