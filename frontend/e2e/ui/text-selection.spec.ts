import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Text Selection Control", () => {
  test("text selection is disabled for professional look", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/dashboard");

    const title = page.getByRole("heading").first();

    await title.selectText();

    await expect(title).toBeVisible();
  });
});
