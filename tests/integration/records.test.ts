import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let server: MongoMemoryServer; let actorId = "";
describe("operational records", () => {
  before(async () => {
    server = await MongoMemoryServer.create(); process.env.MONGODB_URI = server.getUri(); process.env.MONGODB_DB = "records_test"; process.env.SESSION_SECRET = "records-test-secret-at-least-32-characters";
    const { connectDatabase } = await import("../../src/lib/admin/database"); const { StaffUser } = await import("../../src/lib/admin/models");
    await connectDatabase(); const user = await StaffUser.create({ email: "admin@example.test", passwordHash: "unused", displayName: "Admin", role: "Super Admin" }); actorId = String(user._id);
  });
  after(async () => { await mongoose.disconnect(); await server.stop(); });
  it("creates, validates, lists and audits a customer without changing its text identifier", async () => {
    const { createRecord, listRecords } = await import("../../src/lib/admin/records"); const { AdminAudit } = await import("../../src/lib/admin/models");
    const invalid = await createRecord("customers", { customerNumber: "", name: "" }, actorId); assert.equal("error" in invalid, true);
    const created = await createRecord("customers", { customerNumber: "000123", name: "Test Customer", phone: "", email: "", address: "", notes: "" }, actorId); assert.equal("record" in created, true);
    const listed = await listRecords("customers", new URL("http://test/?q=000123")); assert.equal(listed.total, 1); assert.equal(listed.records[0].customerNumber, "000123");
    assert.equal(await AdminAudit.countDocuments({ action: "customers.create" }), 1);
    if (!("record" in created) || !created.record) return;
    const updated = await (await import("../../src/lib/admin/records")).updateRecord("customers", created.record.id, { customerNumber: "000123", name: "Updated Customer", phone: "", email: "", address: "", notes: "" }, actorId);
    assert.equal("record" in updated && updated.record && (updated.record as Record<string, unknown>).name, "Updated Customer");
    assert.equal(await AdminAudit.countDocuments({ action: "customers.update" }), 1);
  });
});
