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
  it("stores a public enquiry privately and exposes it only through the staff support queue", async () => {
    const { submitEnquiry } = await import("../../src/lib/enquiries/service");
    const { listRecords } = await import("../../src/lib/admin/records");
    const submitted = await submitEnquiry({ name: "Website Visitor", email: "visitor@example.com", interest: "Cable TV", message: "Please contact me about a new cable connection.", planLabel: "", website: "" }, "address-hash");
    assert.equal(submitted.ok, true);
    const queue = await listRecords("support", new URL("http://test/?kind=enquiries&q=visitor@example.com"));
    assert.equal(queue.total, 1);
    assert.equal(queue.records[0].deliveryStatus, "pending-email-configuration");
    assert.equal(queue.records[0].destination, "luckycablenetwork1@gmail.com");
    assert.equal("sourceHash" in queue.records[0], false);
  });
  it("atomically accepts no more than three concurrent enquiries per source window", async () => {
    const { submitEnquiry } = await import("../../src/lib/enquiries/service");
    const input = { name: "Concurrent Visitor", email: "concurrent@example.com", interest: "Broadband", message: "Please share broadband connection details.", planLabel: "", website: "" };
    const results = await Promise.all(Array.from({ length: 10 }, () => submitEnquiry(input, "concurrent-address-hash")));
    assert.equal(results.filter(result => result.ok && result.accepted).length, 3);
    assert.equal(results.filter(result => !result.ok && result.status === 429).length, 7);
  });
});
