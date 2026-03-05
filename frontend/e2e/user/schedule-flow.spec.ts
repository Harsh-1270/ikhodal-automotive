import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth.helper";

test.describe("Schedule → Booking Flow", () => {
  test("user can select an available date", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    const availableDate = page.locator(".calendar-day.available").first();
    await availableDate.click();

    await expect(page.locator(".calendar-day.selected")).toHaveCount(1);
  });

  test("user sees time slots after selecting date", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    await page.locator(".calendar-day.available").first().click();

    await expect(page.locator(".timeslots-grid")).toBeVisible();
  });

  test("user can select only available time slot", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    await page.locator(".calendar-day.available").first().click();

    const availableSlot = page.locator(".time-slot:not(.booked)").first();
    await availableSlot.click();

    await expect(page.locator(".time-slot.selected")).toHaveCount(1);
  });

  test("continue button navigates to booking form", async ({ page }) => {
    await loginAsUser(page);
    await page.goto("http://127.0.0.1:3000/schedule");

    await page.locator(".calendar-day.available").first().click();
    await page.locator(".time-slot:not(.booked)").first().click();

    await page.getByRole("button", { name: /continue to booking/i }).click();

    await expect(page).toHaveURL(/booking-form/i);
  });
});
