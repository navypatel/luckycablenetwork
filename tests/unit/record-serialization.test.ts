import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeRecord } from "../../src/lib/admin/records";
describe("admin record serialization", () => {
  it("never returns password hashes, tokens, source buffers, or audit before/after values", () => {
    const record = safeRecord({ _id: "abc", email: "a@example.test", passwordHash: "hash", tokenHash: "token", source: Buffer.from("private"), before: { secret: "old" }, after: { secret: "new" }, action: "settings.update" }, true);
    assert.deepEqual(record, { id: "abc", email: "a@example.test", action: "settings.update" });
  });
});
