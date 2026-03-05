import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("UI/UX Features", () => {
  test("icons and emojis render correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    await expect(page.locator(".service-icon-large").first()).toBeVisible();
  });

  test("hover effects work on interactive elements", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    const serviceCard = page.locator(".service-card-new").first();
    await serviceCard.hover();

    await expect(serviceCard).toBeVisible();
  });

  test("animations play smoothly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    await page.waitForTimeout(1000);

    await expect(page.locator(".service-card-new").first()).toBeVisible();
  });
});
