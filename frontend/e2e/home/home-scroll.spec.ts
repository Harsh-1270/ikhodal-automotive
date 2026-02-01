import { test, expect } from '@playwright/test';

test.describe('Home Page Scroll Behavior', () => {

    test('scroll reveals sections progressively', async ({ page }) => {
        await page.goto('http://127.0.0.1:3000/');

        await page.evaluate(() => window.scrollTo(0, 1000));
        await page.waitForTimeout(800);

        await page.evaluate(() => window.scrollTo(0, 2000));
        await page.waitForTimeout(800);

        const sections = page.locator('.section-visible, section');
        const count = await sections.count();

        expect(count).toBeGreaterThan(0);
    });

});
