import { test, expect } from "@playwright/test";

test("logo uses a transparent derivative without a white CSS box", async ({ page }) => {
  for (const route of ["/", "/preview/admin"]) {
    await page.goto(route);
    const logo = page.getByAltText("Lucky Cable Network — Future Ready").first();
    await expect(logo).toHaveAttribute("src", /lucky-cable-logo\.png/);
    expect(await logo.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    const alpha = await logo.evaluate(async el => {
      const img = el as HTMLImageElement;
      await img.decode();
      const canvas = document.createElement("canvas"); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!; ctx.drawImage(img, 0, 0);
      return [ctx.getImageData(0, 0, 1, 1).data[3], ctx.getImageData(870, 300, 1, 1).data[3]];
    });
    expect(alpha).toEqual([0, 255]);
  }
});

test("layered scene assembles with scroll and remains usable with reduced motion", async ({ page }) => {
  await page.goto("/");
  const scene = page.getByRole("region", { name: "A connection, layer by layer" });
  await expect(scene).toBeAttached();
  await page.evaluate(() => {
    const scene = document.querySelector<HTMLElement>(".connection-cinema")!;
    window.scrollTo({ top: scene.offsetTop + scene.offsetHeight * .55, behavior: "instant" });
  });
  await expect.poll(() => scene.evaluate(el => Number((el as HTMLElement).style.getPropertyValue("--assembly")))).toBeGreaterThan(.4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".cinema-sticky")).toHaveCSS("position", "relative");
  await expect(scene.getByRole("link", { name: "Explore the connection" })).toHaveAttribute("href", "/services");
});

test("provider image gallery contains only supplied images and every image loads", async ({ page }) => {
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Provider image gallery" });
  const pagination = gallery.getByRole("group", { name: "Choose a provider" });
  await expect(pagination.getByRole("button", { name: /^Show / })).toHaveCount(10);
  await expect(gallery.locator(".provider-carousel-stage .provider-image-surface")).toHaveCount(3);
  const stage = gallery.locator(".provider-carousel-stage");
  await expect(stage.locator(".provider-image-surface")).toHaveCount(3);
  await expect(stage.locator(".provider-image-surface.is-active img")).toHaveAttribute("src", "/providers/zee.png");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(gallery.locator(".provider-carousel-stage .provider-image-surface")).toHaveCount(3);
  for (const name of ["ZEE", "Sony", "Star", "Disney", "Sun TV", "Cartoon Network", "Discovery", "Hungama", "Daman News", "Sankalp News Gujarati"]) {
    const button = pagination.getByRole("button", { name: `Show ${name}` });
    await button.click();
    await expect(gallery.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect.poll(() => gallery.locator(".provider-image-surface.is-active img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(gallery.locator(".provider-image-surface.is-active img")).toHaveCSS("object-fit", "contain");
  }
  await expect(gallery.getByText(/does not confirm channel availability, package inclusion or subscription rights/)).toBeVisible();
});

test("reference video is not a public asset", async ({ request }) => {
  expect((await request.get("/siteref.mp4")).status()).toBe(404);
});