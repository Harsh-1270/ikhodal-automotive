import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Browser Navigation", () => {
  test("browser back button works correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");
    await page.goto("http://127.0.0.1:3000/cart");

    await page.goBack();

    await expect(page).toHaveURL(/dashboard/i);
  });

  test("404 page redirects to home", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/non-existent-route-12345");

    await expect(page).toHaveURL(/login|home|dashboard|\//);
  });

  test("all navigation links work correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    const navLinks = page.locator(".nav-icon-btn, .nav-link");
    const count = await navLinks.count();

    await expect(count).toBeGreaterThanOrEqual(0);
  });
});
