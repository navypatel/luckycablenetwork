import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loginAddress } from "../../src/lib/admin/login-address";
describe("login throttle address", () => {
  it("uses Vercel's client address in production and an isolated local fallback", () => {
    const headers = new Headers({ "x-vercel-forwarded-for": "203.0.113.5, 10.0.0.1", "x-forwarded-for": "spoofed" });
    assert.equal(loginAddress(headers, { VERCEL: "1" }), "203.0.113.5");
    assert.equal(loginAddress(headers, {}), "local");
  });
});
