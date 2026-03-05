import { test, expect } from "@playwright/test";

test.describe("User Registration", () => {
  test("user can open registration page", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/register");

    await expect(
      page.getByRole("heading", { name: /create account|register/i }),
    ).toBeVisible();
  });

  test("registration form fields are visible", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/register");

    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("registration validation works", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/register");

    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/required/i).first()).toBeVisible();
  });
});
