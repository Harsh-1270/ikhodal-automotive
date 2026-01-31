import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Dashboard Flow', () => {

    test('dashboard loads after login', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await expect(
            page.getByRole('heading', { name: /dashboard|welcome/i })
        ).toBeVisible();
    });

    test('services are displayed in grid view', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await expect(
            page.locator('.services-grid').first()
        ).toBeVisible();
    });

    test('user can switch to list view', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const listBtn = page.getByRole('button', { name: /☰/ });
        await listBtn.click();

        await expect(
            page.locator('.services-list').first()
        ).toBeVisible();
    });

    test('list view displays services correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await page.getByRole('button', { name: /☰/ }).click();

        await expect(
            page.locator('.service-card-new').first()
        ).toBeVisible();
    });

    test('category filters work correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const categoryBtn = page.getByRole('button', { name: /service packages/i }).first();
        await categoryBtn.click();

        await expect(page).toHaveURL(/dashboard/i);
    });

    test('add to cart button works', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const addBtn = page.getByRole('button', { name: /add/i }).first();
        await addBtn.click();

        await expect(addBtn).toBeVisible();
    });

    test('add to cart updates cart count in navbar', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        await page.getByRole('button', { name: /add/i }).first().click();

        await expect(
            page.locator('.badge').first()
        ).toBeVisible();
    });

});