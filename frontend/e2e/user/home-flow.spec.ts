import { test, expect } from "@playwright/test";

test.describe("Home/Landing Page", () => {
  test("home page loads correctly", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");

    await expect(
      page.getByRole("heading", { name: /khodal|automotive/i }).first(),
    ).toBeVisible();
  });

  test("navigation to login from home works", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");

    await page.getByRole("button", { name: /login|sign in/i }).click();

    await expect(page).toHaveURL(/login/i);
  });

  test("navigation to register from home works", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");

    await page
      .getByRole("button", { name: /register|sign up|get started/i })
      .click();

    await expect(page).toHaveURL(/register/i);
  });

  test("scroll animations work on home page", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/");

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    await expect(page.locator(".section-visible").first()).toBeVisible();
  });
});
