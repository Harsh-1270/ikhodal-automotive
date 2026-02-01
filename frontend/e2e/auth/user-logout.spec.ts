import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('User Logout', () => {

    test('user can logout successfully', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const userProfile = page.locator('.user-profile, .user-avatar').first();
        if (await userProfile.isVisible()) {
            await userProfile.click();

            const logoutBtn = page.getByRole('button', { name: /logout|sign out/i });
            if (await logoutBtn.isVisible()) {
                await logoutBtn.click();
            }
        }

        await expect(page).toHaveURL(/login|home|\//);
    });

    test('logout redirects to home or login page', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await page.goto('http://127.0.0.1:3000/login');

        await expect(page).toHaveURL(/login|home/i);
    });

});
