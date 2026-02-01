import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Success Notifications', () => {

    test('success notifications appear', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const addBtn = page.getByRole('button', { name: /add/i }).first();
        if (await addBtn.isVisible()) {
            await addBtn.click();

            await page.waitForTimeout(500);

            const badge = page.locator('.badge').first();
            await expect(badge).toBeVisible();
        }
    });

});
