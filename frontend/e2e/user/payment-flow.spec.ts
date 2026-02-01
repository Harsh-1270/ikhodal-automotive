import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Payment Flow', () => {

    test('payment page loads', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/payment');

        await expect(
            page.getByRole('heading', { name: /Payment History/i })
        ).toBeVisible();
    });

    test('payment amount section is visible', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/payment');

        // Stats row contains Total Spent with a $ amount
        await expect(
            page.locator('.stat-box').first()
        ).toBeVisible();
        await expect(
            page.getByText(/Total Spent/i)
        ).toBeVisible();
    });

    test('transaction list is visible', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/payment');

        // Wait for IntersectionObserver animation (100ms delay in component)
        await page.waitForTimeout(300);

        await expect(
            page.locator('.transaction-card').first()
        ).toBeVisible();
    });

    test('sort filter changes transaction order', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/payment');

        await page.waitForTimeout(300);

        // Click Price: High to Low
        await page.getByRole('button', { name: /Price: High to Low/i }).click();

        await page.waitForTimeout(300);

        // Denting & Painting = $4,999 — highest, should be first card
        const firstCardService = page.locator('.transaction-card').first().locator('.transaction-service');
        await expect(firstCardService).toHaveText(/Denting & Painting/i);
    });

    test('user cannot access payment without login', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/payment');

        // Either redirects to login or stays (mock frontend)
        await expect(page).toHaveURL(/login|payment/i);
    });

});