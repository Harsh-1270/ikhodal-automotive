import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Cart Operations', () => {

    test('user can increase quantity', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        const plusBtn = page.locator('.qty-btn').filter({ hasText: '+' }).first();
        const qtyValue = page.locator('.qty-value').first();

        const initialQty = await qtyValue.textContent();
        await plusBtn.click();

        await expect(qtyValue).not.toHaveText(initialQty || '');
    });

    test('user can decrease quantity', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        const minusBtn = page.locator('.qty-btn').filter({ hasText: '−' }).first();
        await minusBtn.click();

        await expect(page.locator('.qty-value').first()).toBeVisible();
    });

    test('user can remove item from cart', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        const removeBtn = page.getByRole('button', { name: /remove/i }).first();
        await removeBtn.click();

        await expect(page.locator('.cart-item')).toHaveCount(2);
    });

    test('price calculations are correct', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await expect(page.getByText(/subtotal/i)).toBeVisible();
        await expect(page.getByText(/gst/i)).toBeVisible();
        await expect(page.getByText(/total amount/i)).toBeVisible();
    });

    test('schedule appointment button navigates to schedule', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await page.getByRole('button', { name: /schedule appointment/i }).click();

        await expect(page).toHaveURL(/schedule/i);
    });

    test('clear cart removes all items', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/cart');

        await page.getByRole('button', { name: /clear cart/i }).click();

        await expect(
            page.getByRole('heading', { name: /your cart is empty/i })
        ).toBeVisible();
    });

});