import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("User Booking Flow", () => {
  test("user can open booking flow", async ({ page }) => {
    await loginAsUser(page);

    // Go to home manually (since auth is mock-only)
    await page.goto("http://127.0.0.1:3000/home");

    // Assert services are visible (core booking entry)
    await expect(
      page.getByRole("button", { name: /book service/i }),
    ).toBeVisible();
  });
});
