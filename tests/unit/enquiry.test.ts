import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEnquiry } from "../../src/lib/enquiries/validation";
import { readJsonWithinLimit } from "../../src/lib/enquiries/request";

describe("public enquiry validation", () => {
  const valid = { name: "Test Visitor", email: "TEST@example.com", interest: "Broadband", message: "Please share current broadband availability.", planLabel: "100 Mbps", website: "" };

  it("normalizes a valid enquiry and assigns pending email delivery", () => {
    const result = parseEnquiry(valid);
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.email, "test@example.com");
    assert.equal(result.data.deliveryStatus, "pending-email-configuration");
    assert.equal(result.data.destination, "luckycablenetwork1@gmail.com");
  });

  it("rejects invalid fields and silently identifies a filled honeypot", () => {
    assert.equal(parseEnquiry({ ...valid, message: "short" }).success, false);
    const bot = parseEnquiry({ ...valid, website: "https://spam.example" });
    assert.equal(bot.success, false);
    if (!bot.success) assert.equal(bot.spam, true);
  });
});

describe("public enquiry request budget", () => {
  it("measures actual UTF-8 bytes instead of trusting Content-Length", async () => {
    const request = new Request("http://test/api/enquiries", { method: "POST", headers: { "content-length": "1" }, body: JSON.stringify({ message: "é".repeat(100) }) });
    await assert.rejects(() => readJsonWithinLimit(request, 100), /too large/i);
  });
});