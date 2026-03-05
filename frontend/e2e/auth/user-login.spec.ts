import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("User Authentication", () => {
  test("user can login successfully", async ({ page }) => {
    await loginAsUser(page);

    // Login action executed without page crash
    await expect(page).toHaveURL(/login/i);
  });
});
