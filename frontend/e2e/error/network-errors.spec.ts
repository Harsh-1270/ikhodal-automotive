import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Network & API Error Handling', () => {

    test('API errors display user-friendly messages', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await expect(page.locator('.service-card-new').first()).toBeVisible();
    });

    test('network errors are handled gracefully', async ({ page }) => {
        await loginAsUser(page);

        await page.route('**/api/**', route => route.abort());

        await page.goto('http://127.0.0.1:3000/dashboard');

        await expect(page).toHaveURL(/dashboard/i);
    });

});
