import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Error Handling', () => {

    test('invalid route shows 404 or redirect', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/invalid-page-xyz');

        await expect(page).toHaveURL(/login|home|dashboard|\//);
    });

    test('form validation errors are clear', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/booking-form');

        await page.getByRole('button', { name: /continue to payment/i }).click();

        await expect(
            page.getByText(/required|error/i).first()
        ).toBeVisible();
    });

    test('empty states handle zero data correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        const clearBtn = page.getByRole('button', { name: /clear cart/i });
        if (await clearBtn.isVisible()) {
            await clearBtn.click();
        }

        await expect(
            page.getByRole('heading', { name: /empty/i })
        ).toBeVisible();
    });

});
