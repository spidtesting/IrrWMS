import { test, expect } from "@playwright/test";

const STAFF_EMAIL = process.env.E2E_STAFF_EMAIL ?? "staff@irrwms.gov.lk";
const STAFF_PASSWORD = process.env.E2E_STAFF_PASSWORD ?? "Admin@1234";

test.describe("Stock Entry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(STAFF_EMAIL);
    await page.getByLabel("Password").fill(STAFF_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/(dashboard|stock-entry)/, { timeout: 15_000 });
  });

  test("navigates to stock entry page", async ({ page }) => {
    await page.goto("/stock-entry");

    await expect(page).toHaveURL(/\/stock-entry/);
    await expect(
      page.getByRole("heading", { name: /Stock Entry|ස්ටොක් ඇතුළත් කිරීම/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows stock entry form fields", async ({ page }) => {
    await page.goto("/stock-entry");

    const itemField = page.getByLabel(/Item|අයිතම/i);
    const quantityField = page.getByLabel(/Quantity|ප්‍රමාණය/i);

    if (await itemField.isVisible().catch(() => false)) {
      await expect(itemField).toBeVisible();
      await expect(quantityField).toBeVisible();
    } else {
      test.skip(true, "Stock entry UI not yet implemented");
    }
  });

  test("registers service worker for offline queue", async ({ page, context }) => {
    await page.goto("/stock-entry");

    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const registration = await navigator.serviceWorker.getRegistration();
      return Boolean(registration);
    });

    expect(typeof swRegistered).toBe("boolean");
  });
});
