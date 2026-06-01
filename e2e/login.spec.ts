import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@irrwms.gov.lk";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Admin@1234";

test.describe("Login", () => {
  test("shows login form with bilingual header", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "IrrWMS" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email address").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password. Please try again.")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("redirects to dashboard after successful login", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email address").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("forgot password link navigates correctly", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Forgot password?" }).click();

    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
  });

  test("toggles language on login page", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /EN \/ SI|SI \/ EN/ }).click();

    await expect(page.getByRole("heading", { name: "නැවත සාදරයෙන් පිළිගනිමු" })).toBeVisible();
  });
});
