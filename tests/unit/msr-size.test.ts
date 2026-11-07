import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withinMsrDocumentBudget } from "../../src/lib/admin/msr-size";
describe("MSR document budget", () => {
  it("reserves MongoDB BSON overhead for source bytes and parsed entries", () => {
    assert.equal(withinMsrDocumentBudget(3_500_000, [{ value: "x".repeat(1_000) }]), true);
    assert.equal(withinMsrDocumentBudget(3_500_000, [{ value: "x".repeat(10_000_000) }]), false);
  });
});
