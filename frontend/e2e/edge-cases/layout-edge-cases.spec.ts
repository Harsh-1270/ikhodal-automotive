import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Layout Edge Cases', () => {

    test('very long service names do not break layout', async ({ page }) => {
        await loginAsUser(page);
        await page.goto('http://127.0.0.1:3000/dashboard');

        const serviceCard = page.locator('.service-card-new').first();
        await expect(serviceCard).toBeVisible();

        const cardBox = await serviceCard.boundingBox();
        if (cardBox) {
            expect(cardBox.width).toBeLessThan(1000);
        }
    });

});
