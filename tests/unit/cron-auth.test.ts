import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validCronAuthorization } from "../../src/lib/admin/cron-auth";

describe("cron authorization", () => {
  it("requires an exact bearer secret and fails closed when configuration is absent", () => {
    assert.equal(validCronAuthorization("Bearer keepalive-secret-1234567890123456", "keepalive-secret-1234567890123456"), true);
    assert.equal(validCronAuthorization("Bearer wrong-secret", "keepalive-secret-1234567890123456"), false);
    assert.equal(validCronAuthorization(null, "keepalive-secret-1234567890123456"), false);
    assert.equal(validCronAuthorization("Bearer keepalive-secret-1234567890123456", undefined), false);
    assert.equal(validCronAuthorization("Bearer short", "short"), false);
  });
});
