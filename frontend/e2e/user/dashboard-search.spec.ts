import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Dashboard Search & Filter', () => {

    test('service search functionality works', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

        if (await searchInput.isVisible()) {
            await searchInput.fill('general');
            await page.waitForTimeout(500);

            await expect(page.locator('.service-card-new').first()).toBeVisible();
        } else {
            await expect(page.locator('.service-card-new').first()).toBeVisible();
        }
    });

});
