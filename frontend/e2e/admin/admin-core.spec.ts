import { test, expect } from "@playwright/test";

test.describe("Admin Core Pages (Mock)", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/admin/login");

    await expect(
      page.getByRole("heading", { name: /admin login/i }),
    ).toBeVisible();

    await expect(page.getByText(/coming soon/i)).toBeVisible();
  });

  test("admin dashboard route redirects safely", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/admin");

    // Mock behavior: unauthenticated admin redirects to home
    await expect(page).toHaveURL(/\/$/);
  });

  test("admin schedule page loads", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/admin/schedule");

    await expect(page).toHaveURL(/admin\/schedule/i);
  });

  test("admin users page loads", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/admin/users");

    await expect(page).toHaveURL(/admin\/users/i);
  });
});
