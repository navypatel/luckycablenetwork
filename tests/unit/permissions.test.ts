import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can } from "../../src/lib/admin/permissions";

describe("provisional server permission matrix", () => {
  it("follows the specification's starting roles and still denies unrelated writes", () => {
    assert.equal(can("Super Admin", "settings", "manage"), true);
    assert.equal(can("Management", "msr", "approve"), true);
    assert.equal(can("Management", "customers", "create"), false);
    assert.equal(can("Management", "users", "view"), false);
    assert.equal(can("Accounts", "billing", "create"), true);
    assert.equal(can("Accounts", "customers", "update"), false);
    assert.equal(can("Operations", "channels", "update"), true);
    assert.equal(can("Operations", "billing", "view"), false);
    assert.equal(can("Support", "support", "create"), true);
    assert.equal(can("Support", "customers", "view"), true);
    assert.equal(can("Support", "customers", "update"), false);
    assert.equal(can("Report Viewer", "msr", "export"), true);
    assert.equal(can("Report Viewer", "msr", "import"), false);
    assert.equal(can("Report Viewer", "customers", "view"), false);
  });
});

