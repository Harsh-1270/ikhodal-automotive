import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth.helper';

test.describe('Slot Availability', () => {
  test('unavailable slots are shown as booked', async ({ page }) => {
    await loginAsUser(page);

    await page.goto('http://127.0.0.1:3000/schedule');

    // Select any available date first (required to show slots)
    await page.locator('.calendar-day.available').first().click();

    // Assert at least one booked slot exists
    const bookedSlot = page.locator('.time-slot.booked').first();
    await expect(bookedSlot).toBeVisible();

    // Ensure user cannot select booked slot
    await bookedSlot.click();
    await expect(page.locator('.time-slot.selected')).toHaveCount(0);
  });
});
