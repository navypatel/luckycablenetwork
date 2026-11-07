import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { retryTransient, isTransientMongoError } from "../../src/lib/admin/database-resilience";

describe("database resilience", () => {
  it("retries transient connectivity failures and returns the successful result", async () => {
    let attempts = 0; const delays: number[] = [];
    const result = await retryTransient(async () => { attempts += 1; if (attempts < 3) throw Object.assign(new Error("selection timeout"), { name: "MongoServerSelectionError" }); return "connected"; }, { attempts: 3, baseDelayMs: 10, sleep: async ms => { delays.push(ms); } });
    assert.equal(result, "connected"); assert.equal(attempts, 3); assert.deepEqual(delays, [10, 20]);
  });
  it("does not retry authentication/configuration failures", async () => {
    let attempts = 0;
    await assert.rejects(() => retryTransient(async () => { attempts += 1; throw Object.assign(new Error("bad auth"), { name: "MongoServerError", code: 18 }); }, { attempts: 3, baseDelayMs: 1, sleep: async () => {} }));
    assert.equal(attempts, 1); assert.equal(isTransientMongoError({ name: "MongoServerError", code: 18 }), false);
  });
});
