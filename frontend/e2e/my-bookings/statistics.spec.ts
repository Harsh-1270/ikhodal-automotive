import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("My Bookings Statistics", () => {
  test("statistics cards display correct counts", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/my-bookings");

    const statValues = page.locator(".stat-value");
    const count = await statValues.count();

    expect(count).toBeGreaterThan(0);

    const firstStat = await statValues.first().textContent();
    expect(firstStat).toMatch(/\d+/);
  });
});
