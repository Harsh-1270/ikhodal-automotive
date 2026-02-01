import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Cart Management', () => {

    test('cart page loads correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await expect(
            page.getByRole('heading', { name: /cart/i })
        ).toBeVisible();
    });

    test('empty cart shows empty state', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        // Clear cart first
        const clearBtn = page.getByRole('button', { name: /clear cart/i });
        if (await clearBtn.isVisible()) {
            await clearBtn.click();
        }

        await expect(
            page.getByRole('heading', { name: /your cart is empty/i })
        ).toBeVisible();
    });

    test('continue shopping navigates to dashboard', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        // Clear cart to show "Browse Services" button
        const clearBtn = page.getByRole('button', { name: /clear cart/i });
        if (await clearBtn.isVisible()) {
            await clearBtn.click();
        }

        const browseBtn = page.getByRole('button', { name: /browse services/i });
        await browseBtn.click();

        await expect(page).toHaveURL(/dashboard/i);
    });

    test('schedule appointment button is visible', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await expect(
            page.getByRole('button', { name: /schedule/i })
        ).toBeVisible();
    });

});
