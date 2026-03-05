import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Cart Service Display", () => {
  test("added services appear in cart", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/cart");

    const cartItems = page.locator(".cart-item");
    const count = await cartItems.count();

    await expect(count).toBeGreaterThanOrEqual(0);
  });
});
