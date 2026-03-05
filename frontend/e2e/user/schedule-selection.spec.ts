import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Schedule Selection", () => {
  test("user can open schedule selection page", async ({ page }) => {
    await loginAsUser(page);

    // Go directly to schedule page (safe for mock frontend)
    await page.goto("http://127.0.0.1:3000/schedule");

    // Assert page loaded (title or main text)
    await expect(page.getByText(/schedule|select date/i)).toBeVisible();
  });
});
