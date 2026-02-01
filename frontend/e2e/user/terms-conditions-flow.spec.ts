import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Terms & Conditions Flow', () => {

    test('terms page loads', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/terms');

        await expect(
            page.getByRole('heading', { name: /Terms & Conditions/i })
        ).toBeVisible();
    });

    test('all 14 term sections are rendered', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/terms');

        await page.waitForTimeout(300);

        // 14 term-card divs exist in DOM
        const cards = page.locator('.term-card');
        await expect(cards).toHaveCount(14);
    });

    test('see more expands section details', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/terms');

        await page.waitForTimeout(300);

        // Click first "See More" button
        const firstSeeMore = page.locator('.see-more-btn').first();
        await firstSeeMore.click();

        // Details list inside first card becomes visible (expanded class added)
        const firstCard = page.locator('.term-card').first();
        await expect(
            firstCard.locator('.term-details.expanded')
        ).toBeVisible();

        // Button text changes to "See Less"
        await expect(firstSeeMore).toHaveText(/See Less/i);
    });

    test('see less collapses section details', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/terms');

        await page.waitForTimeout(300);

        const firstSeeMore = page.locator('.see-more-btn').first();

        // Expand
        await firstSeeMore.click();
        await expect(firstSeeMore).toHaveText(/See Less/i);

        // Collapse
        await firstSeeMore.click();
        await expect(firstSeeMore).toHaveText(/See More/i);
    });

    test('back to dashboard button navigates correctly', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/terms');

        await page.waitForTimeout(300);

        // Scroll to footer where the button is
        await page.locator('.contact-btn').scrollIntoViewIfNeeded();

        await page.getByRole('button', { name: /Back to Dashboard/i }).click();

        await expect(page).toHaveURL(/dashboard/i);
    });

});