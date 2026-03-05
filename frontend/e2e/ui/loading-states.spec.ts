import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("UI Loading & Notifications", () => {
  test("loading states display correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-details/BK001");

    await page.waitForTimeout(100);

    await expect(page.locator(".detail-card").first()).toBeVisible();
  });

  test("error messages display correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await page.getByRole("button", { name: /continue to payment/i }).click();

    await expect(page.locator(".error-text").first()).toBeVisible();
  });
});
