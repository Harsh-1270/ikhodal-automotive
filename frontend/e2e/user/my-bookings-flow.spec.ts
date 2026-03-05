import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("My Bookings", () => {
  test("my bookings page loads", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/my-bookings");

    await expect(
      page.getByRole("heading", { name: /bookings/i }),
    ).toBeVisible();
  });

  test("filter tabs are visible", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/my-bookings");

    await expect(page.getByRole("button", { name: /all/i })).toBeVisible();
  });

  test("statistics cards display", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/my-bookings");

    await expect(page.locator(".stat-box").first()).toBeVisible();
  });
});
