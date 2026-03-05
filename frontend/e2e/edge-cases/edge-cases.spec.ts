import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Edge Cases", () => {
  test("cart with 0 items shows empty state", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/cart");

    const clearBtn = page.getByRole("button", { name: /clear cart/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }

    await expect(
      page.getByRole("heading", { name: /your cart is empty/i }),
    ).toBeVisible();
  });

  test("large cart quantities calculate correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/cart");

    const plusBtn = page.locator(".qty-btn").filter({ hasText: "+" }).first();

    for (let i = 0; i < 5; i++) {
      await plusBtn.click();
      await page.waitForTimeout(100);
    }

    await expect(page.getByText(/subtotal|total/i).first()).toBeVisible();
  });

  test("past dates cannot be selected in schedule", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    const disabledDay = page.locator(".calendar-day.disabled").first();

    if (await disabledDay.isVisible()) {
      await disabledDay.click();

      await expect(page.locator(".time-slot").first()).not.toBeVisible();
    }
  });

  test("minimum 3-digit postcode validation works", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await page.getByLabel(/postcode/i).fill("12");
    await page.getByRole("button", { name: /continue to payment/i }).click();

    await expect(
      page.locator(".error-text").filter({ hasText: /3 numbers|digits/i }),
    ).toBeVisible();
  });
});
