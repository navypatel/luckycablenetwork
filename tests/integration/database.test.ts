import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

let server: MongoMemoryServer;
let actorId: string;

describe("MongoDB-backed MSR service", () => {
  before(async () => {
    server = await MongoMemoryServer.create();
    process.env.MONGODB_URI = server.getUri();
    process.env.MONGODB_DB = "lucky_cable_test";
    process.env.SESSION_SECRET = "integration-test-secret-at-least-32-characters";
    const { connectDatabase } = await import("../../src/lib/admin/database");
    const { StaffUser } = await import("../../src/lib/admin/models");
    await connectDatabase();
    const user = await StaffUser.create({ email: "admin@example.test", passwordHash: "not-used", displayName: "Test Admin", role: "Super Admin" });
    actorId = String(user._id);
  });
  after(async () => { await mongoose.disconnect(); await server.stop(); });

  it("reconnects after a cached connection has been closed", async () => {
    const { connectDatabase } = await import("../../src/lib/admin/database");
    await mongoose.disconnect();
    assert.equal(mongoose.connection.readyState, 0);
    await connectDatabase();
    assert.equal(mongoose.connection.readyState, 1);
  });

  it("stages the real workbook privately, rejects duplicate upload, and commits once", async () => {
    const { stageMsr, commitMsr } = await import("../../src/lib/admin/msr-service");
    const { MsrReport, AdminAudit } = await import("../../src/lib/admin/models");
    const bytes = readFileSync(resolve("124190_SMS_EXL_JUN_2025.xlsx"));
    const staged = await stageMsr(bytes, "124190_SMS_EXL_JUN_2025.xlsx", "2025-06", actorId);
    assert.equal("error" in staged, false);
    if ("error" in staged) return;
    assert.equal(staged.status, "staged");
    const stored = await MsrReport.findById(staged.id).lean();
    assert.equal(Buffer.from(stored.source.buffer).equals(bytes), true);
    assert.equal(stored.entries.length > 0, true);
    const duplicate = await stageMsr(bytes, "124190_SMS_EXL_JUN_2025.xlsx", "2025-06", actorId);
    assert.equal("error" in duplicate && duplicate.status, 409);
    const committed = await commitMsr(staged.id, actorId);
    assert.deepEqual(committed, { id: staged.id, status: "imported" });
    const second = await commitMsr(staged.id, actorId);
    assert.equal("error" in second && second.status, 409);
    assert.equal(await AdminAudit.countDocuments({ target: staged.id }), 2);
  });
});
