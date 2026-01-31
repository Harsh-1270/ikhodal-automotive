import { Page, expect } from '@playwright/test';
import { mockUsers } from '../fixtures/mockData';

/**
 * Login as normal user
 */
export async function loginAsUser(page: Page) {
    await page.goto('http://127.0.0.1:3000/login');

    await page.getByLabel(/email/i).fill(mockUsers.customer.email);
    await page.getByLabel(/password/i).fill(mockUsers.customer.password);

    // Assert login form is no longer showing error
    await expect(
        page.getByText(/invalid|error/i)
    ).not.toBeVisible();
}

/**
 * Login as admin user
 */
export async function loginAsAdmin(page: Page) {
    await page.goto('http://127.0.0.1:3000/admin/login');

    // Admin login inputs (no labels, no types)
    const inputs = page.locator('input');

    await inputs.nth(0).fill(mockUsers.admin.email);
    await inputs.nth(1).fill(mockUsers.admin.password);

    await page.getByRole('button', { name: /login/i }).click();



    // Assert admin dashboard loaded
    await expect(page).toHaveURL(/admin/i);
}
