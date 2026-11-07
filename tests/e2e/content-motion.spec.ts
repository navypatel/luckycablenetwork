import { test, expect } from "@playwright/test";

test("director and technology partner details are text, not reference screenshots", async ({ page, request }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Mrs. Preeti Patel" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mrs. Neeta Patel" })).toBeVisible();
  await expect(page.getByText("Non-Executive Director", { exact: true })).toHaveCount(2);
  for (const name of ["SUMAVISION", "NSTV (Novel Super TV)", "NAGRA", "PANODIC", "MYBOX", "KINGVON", "OVT", "CableGuy CATV"]) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
  for (const file of ["directors.png", "partners.png", "contact%20us.png"]) expect((await request.get(`/${file}`)).status()).toBe(404);
});

test("contact information is actionable and draft delivery remains honest", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: /9512340080/ }).first()).toHaveAttribute("href", "tel:+919512340080");
  await expect(page.getByRole("link", { name: /9512340930/ }).first()).toHaveAttribute("href", "tel:+919512340930");
  await expect(page.getByText("Ashik C Patel", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /9512340145/ })).toHaveAttribute("href", "tel:+919512340145");
  await expect(page.getByRole("link", { name: "luckycablenetwork1@gmail.com" }).first()).toHaveAttribute("href", "mailto:luckycablenetwork1@gmail.com");
  await expect(page.getByText(/SURVEY NO 234\/2, KUND FALIA BHIMPORE/).first()).toBeVisible();
  await expect(page.getByText("26AAGFL0825L1Z9", { exact: true })).toBeVisible();
  await expect(page.getByText("This form prepares a local draft only.")).toBeVisible();
});

test("provider carousel keeps layered neighbours while scroll, keyboard and selection change the active card", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Provider image gallery" });
  await expect(carousel).toHaveAttribute("data-motion", "scroll");
  await expect(carousel.locator(".provider-image-surface")).toHaveCount(3);
  await expect(carousel.locator(".provider-image-surface.is-active")).toHaveCount(1);
  await expect(carousel.locator('.provider-image-surface[data-provider-slot="-1"]')).toBeVisible();
  await expect(carousel.locator('.provider-image-surface[data-provider-slot="1"]')).toBeVisible();
  const travel = await carousel.evaluate(el => el.clientHeight - innerHeight);
  const top = await carousel.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(({ top, travel }) => window.scrollTo({ top: top + travel * .35, behavior: "instant" }), { top, travel });
  await expect(carousel.getByRole("heading", { name: "Disney", exact: true })).toBeVisible();
  await expect(carousel.locator(".provider-image-surface")).toHaveCount(3);
  await page.getByTestId("provider-frame").focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.getByRole("heading", { name: "Sun TV", exact: true })).toBeVisible();
  await expect(carousel.locator(".provider-image-surface.is-active img")).toHaveAttribute("src", "/providers/sun.jpg");
  await page.getByRole("button", { name: "Next provider" }).click();
  await expect(carousel.getByRole("heading", { name: "Cartoon Network", exact: true })).toBeVisible();
  await expect(carousel.getByText(/does not confirm channel availability/)).toBeVisible();
});

test("scroll motion progresses and reduced motion disables spatial effects", async ({ page }) => {
  await page.goto("/");
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator("#experience")).toBeVisible();
  await expect.poll(() => page.locator(".page-progress").evaluate(el => getComputedStyle(el).transform)).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const carousel = page.getByRole("region", { name: "Provider image gallery" });
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toHaveAttribute("data-motion", "reduced");
  await expect(carousel.getByRole("button", { name: "Next provider" })).toBeEnabled();
  await expect.poll(() => page.locator(".day-composition").evaluate(el => getComputedStyle(el).translate)).toBe("none");
});

test("reduced-motion users can browse providers without scroll pinning", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Provider image gallery" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(carousel).toHaveAttribute("data-motion", "reduced");
  await expect(carousel.locator(".broadcaster-sticky")).toHaveCSS("position", "relative");
  await expect(carousel).toHaveCSS("min-height", "0px");
  await carousel.getByRole("button", { name: "Show Sun TV" }).click();
  await expect(carousel.getByRole("heading", { name: "Sun TV", exact: true })).toBeVisible();
});