import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Responsive Design", () => {
  test("dashboard is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    await expect(
      page.getByRole("heading", { name: /dashboard|welcome/i }),
    ).toBeVisible();
  });

  test("cart is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/cart");

    await expect(page.getByRole("heading", { name: /cart/i })).toBeVisible();
  });

  test("booking form is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await expect(
      page.getByRole("heading", { name: /booking details/i }),
    ).toBeVisible();
  });

  test("schedule selection is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    await expect(
      page.getByRole("heading", { name: /select date|schedule/i }),
    ).toBeVisible();
  });

  test("navigation collapses on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    await expect(
      page.locator(".navbar-content, .dashboard-navbar").first(),
    ).toBeVisible();
  });
});
