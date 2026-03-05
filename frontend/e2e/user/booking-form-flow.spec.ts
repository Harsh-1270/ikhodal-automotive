import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Booking Form", () => {
  test("booking form page loads", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await expect(
      page.getByRole("heading", { name: /booking details/i }),
    ).toBeVisible();
  });

  test("progress indicator shows correct step", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await expect(page.locator(".step.active")).toBeVisible();
  });

  test("all form fields are visible", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await expect(page.getByLabel(/make/i)).toBeVisible();
    await expect(page.getByLabel(/model/i)).toBeVisible();
    await expect(page.getByLabel(/year/i)).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/address/i)).toBeVisible();
    await expect(page.getByLabel(/postcode/i)).toBeVisible();
  });

  test("required fields show validation errors", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    const submitBtn = page.getByRole("button", {
      name: /continue to payment/i,
    });
    await submitBtn.click();

    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test("postcode validation works", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await page.getByLabel(/postcode/i).fill("12");
    await page.getByRole("button", { name: /continue to payment/i }).click();

    await expect(page.getByText(/3 numbers|digits/i)).toBeVisible();
  });

  test("form submission works with valid data", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await page.getByLabel(/make/i).fill("Toyota");
    await page.getByLabel(/model/i).fill("Camry");
    await page.getByLabel(/year/i).fill("2020");
    await page.getByLabel(/full name/i).fill("John Doe");
    await page.getByLabel(/address/i).fill("123 Main St");
    await page.getByLabel(/postcode/i).fill("380001");

    await page.getByRole("button", { name: /continue to payment/i }).click();

    await expect(page).toHaveURL(/payment/i);
  });

  test("back to cart button navigates correctly", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/booking-form");

    await page.getByRole("button", { name: /back to cart/i }).click();

    await expect(page).toHaveURL(/cart/i);
  });
});
