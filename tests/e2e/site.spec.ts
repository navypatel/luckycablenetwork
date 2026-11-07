import { test, expect } from "@playwright/test";

test("public routes load with one heading and without overflow or browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/", "/about", "/services", "/services/cable-tv", "/services/broadband", "/packages", "/contact"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  }
  expect(errors).toEqual([]);
});

test("service carousel supports buttons and keyboard", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Explore services" });
  await carousel.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Next service" }).click();
  await expect(page.getByTestId("carousel-status")).toHaveText("Broadband Internet · 2 of 3");
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("carousel-status")).toHaveText("Channel Information · 3 of 3");
  await page.keyboard.press("Home");
  await expect(page.getByTestId("carousel-status")).toHaveText("Cable Television · 1 of 3");
});

test("contact validates and downloads a local draft without claiming delivery", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page.getByText("Enter your name.", { exact: true })).toBeVisible();
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("What would you like to know?").fill("Please share your current broadband options.");
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Your draft is ready. It has not been sent.");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry draft" }).click();
  expect((await downloadEvent).suggestedFilename()).toBe("lucky-cable-enquiry.txt");
});

test("admin preview navigation, search and no business data", async ({ page }) => {
  await page.goto("/preview/admin");
  await expect(page.getByText("Interface preview", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your workspace, ready to connect." })).toBeVisible();
  await page.getByLabel("Find a module").fill("MSR");
  await page.getByRole("link", { name: "MSR Management", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "MSR Management", exact: true })).toBeVisible();
  await expect(page.getByText("No reports connected", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "MSR Management", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("private admin requires staff sign-in and unknown modules are 404", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Staff sign in" })).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByText("Private management workspace. Staff accounts are created by an administrator.")).toBeVisible();
  expect((await page.goto("/preview/admin/not-a-module"))?.status()).toBe(404);
});

test("reduced motion disables ambient motion and navigation remains usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator(".signal-orbit").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.getByRole("link", { name: "Explore services", exact: true }).first().click();
  await expect(page).toHaveURL(/\/services$/);
});

test("workspace navigation responds to viewport and sidebar collapse", async ({ page, isMobile }) => {
  await page.goto("/preview/admin");
  const mobileToggle = page.getByRole("button", { name: "Open workspace navigation" });
  if (isMobile) {
    await mobileToggle.click();
    await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("link", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Workspace navigation" })).toBeHidden();
  } else {
    await expect(mobileToggle).toBeHidden();
    await page.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(page.locator(".admin-shell")).toHaveClass(/collapsed/);
    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(page.locator(".admin-shell")).not.toHaveClass(/collapsed/);
  }
});

test("public mobile menu and pointer carousel dragging work", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About us" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
  } else {
    const rail = page.getByRole("region", { name: "Explore services" });
    await rail.scrollIntoViewIfNeeded();
    const box = await rail.boundingBox();
    if (!box) throw new Error("Carousel was not rendered");
    await page.mouse.move(box.x + box.width * .7, box.y + 70);
    await page.mouse.down();
    await page.mouse.move(box.x + 60, box.y + 70, { steps: 15 });
    await page.mouse.up();
    await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  }
});

test("inherited property service slugs return 404", async ({ page }) => {
  for (const slug of ["constructor", "toString", "__proto__"]) {
    expect((await page.goto(`/services/${slug}`))?.status()).toBe(404);
  }
});

test("carousel final slide remains aligned after scrolling settles", async ({ page }) => {
  await page.goto("/");
  const rail = page.getByRole("region", { name: "Explore services" });
  await rail.focus();
  await page.keyboard.press("End");
  await expect.poll(() => rail.evaluate(element => {
    const cards = Array.from(element.children) as HTMLElement[];
    return Math.abs(element.scrollLeft - (cards[2].offsetLeft - cards[0].offsetLeft));
  })).toBeLessThan(3);
  await expect(page.getByTestId("carousel-status")).toHaveText("Channel Information · 3 of 3");
  await expect(page.getByRole("button", { name: "Next service" })).toBeDisabled();
});

test("mobile workspace menu receives focus and Escape restores toggle", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/admin");
  await page.getByRole("button", { name: "Open workspace navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("link", { name: "Dashboard", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open workspace navigation" })).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Workspace navigation" })).toBeHidden();
});

test("official company logo renders on public and admin surfaces", async ({ page }) => {
  for (const route of ["/", "/preview/admin"]) {
    await page.goto(route);
    const logo = page.getByAltText("Lucky Cable Network — Future Ready").first();
    await expect(logo).toHaveAttribute("src", /lucky-cable-logo/);
    expect(await logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test("favicon resolves to the official image", async ({ request }) => {
  const response = await request.get("/favicon.ico");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/jpeg");
});

test("confirmed local partner channels are displayed without package allocation claims", async ({ page }) => {
  await page.goto("/services/cable-tv");
  await expect(page.getByRole("heading", { name: "Local partner channels" })).toBeVisible();
  for (const name of ["Daman News", "Sankalp News Gujarati"]) {
    const logo = page.getByAltText(name, { exact: true });
    await expect(logo).toBeVisible();
    expect(await logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.getByText("Package inclusion and channel numbers are awaiting confirmation.")).toBeVisible();
});

test("broadband plans preserve flyer totals and reference photo stays private", async ({ page, request }) => {
  await page.goto("/packages");
  const plans = page.locator(".broadband-plan");
  await expect(plans).toHaveCount(5);
  for (const [index, amount] of ["₹9,799", "₹5,999", "₹4,999", "₹4,000", "₹3,499"].entries()) {
    await expect(plans.nth(index)).toContainText(amount);
  }
  await expect(page.getByText("Total advertised price for 12 months")).toHaveCount(3);
  await expect(page.getByText("Total advertised price for 6 months")).toHaveCount(2);
  expect((await request.get("/price.jpeg")).status()).toBe(404);
  await expect(page.locator('img[src*="price.jpeg"]')).toHaveCount(0);
  await plans.first().getByRole("link", { name: "Enquire about this plan" }).click();
  await expect(page.getByText("Enquiring about: 200 Mbps · 12 months · ₹9,799")).toBeVisible();
  await expect(page.getByLabel("What would you like to know?")).toHaveValue(/200 Mbps/);
});