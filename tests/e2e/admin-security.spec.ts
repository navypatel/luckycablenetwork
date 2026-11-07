import { expect, test } from "@playwright/test";

test("protected administrative APIs reject unauthenticated requests", async ({ request }) => {
  for (const [method, path] of [
    ["GET", "/api/admin/customers"],
    ["POST", "/api/admin/customers"],
    ["GET", "/api/admin/msr"],
    ["POST", "/api/admin/msr"]
  ] as const) {
    const response = await request.fetch(path, { method, data: method === "POST" ? {} : undefined, headers: method === "POST" ? { Origin: "http://127.0.0.1:3000" } : undefined });
    expect(response.status(), `${method} ${path}`).toBe(401);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(await response.json()).toEqual({ error: "Authentication or permission required." });
  }
  expect((await request.get("/api/admin/not-a-resource")).status()).toBe(404);
});
