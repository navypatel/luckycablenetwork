import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import ExcelJS from "exceljs";
import { MSR_HEADERS, parseMsrWorkbook } from "../../src/lib/admin/msr-parser";

async function fixture() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("SubscriberReport");
  sheet.addRow([...MSR_HEADERS]);
  sheet.addRow(["00123", "0007", "GJ", "Bouquet", "News", 0, null, 2, null, "Jun-2025"]);
  sheet.addRow(["00123", "0007", "GJ", "Bouquet", "News", 1, 1, 1, 1, "Jun-2025"]);
  sheet.getCell("A2").value = "00123";
  sheet.getCell("B2").value = "0007";
  sheet.getCell("F3").value = { formula: "1+1", result: 2 };
  return parseMsrWorkbook(Buffer.from(await workbook.xlsx.writeBuffer()));
}

describe("MSR workbook parser", () => {
  it("keeps identifiers as text, distinguishes blank counts from zero, and does not execute formulas", async () => {
    const parsed = await fixture();
    assert.equal(parsed.headersOk, true);
    assert.equal(parsed.entries.length, 2);
    assert.equal(parsed.entries[0]?.customerNumber, "00123");
    assert.equal(parsed.entries[0]?.contractNumber, "0007");
    assert.deepEqual(parsed.entries[0]?.weeklyCounts, { day7: 0, day14: null, day21: 2, day28: null });
    assert.equal(parsed.entries[1]?.weeklyCounts.day7, 2);
    assert.equal(parsed.entries[1]?.formulas.day7, "1+1");
    assert.equal(parsed.entries[1]?.issues.some(issue => issue.level === "warning" && issue.message.includes("not recalculated")), true);
    assert.equal(parsed.entries.every(entry => entry.duplicateCandidate), true);
    assert.equal(JSON.stringify(parsed).includes("active subscribers"), false);
  });

  it("rejects workbooks whose expanded XML exceeds the safety budget", async () => {
    const JSZip = (await import("jszip")).default; const zip = new JSZip();
    zip.file("xl/workbook.xml", "x".repeat(17 * 1024 * 1024)); zip.file("xl/_rels/workbook.xml.rels", "rels");
    const parsed = await parseMsrWorkbook(Buffer.from(await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" })));
    assert.match(parsed.errors.join(" "), /expanded workbook content exceeds/i);
  });

  it("rejects files that are not workbooks and macro-enabled files", async () => {
    const malformed = await parseMsrWorkbook(Buffer.from("not-a-workbook"));
    assert.match(malformed.errors.join(" "), /not an Excel workbook/i);
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("SubscriberReport").addRow([...MSR_HEADERS]);
    const bytes = Buffer.from(await workbook.xlsx.writeBuffer());
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(bytes);
    zip.file("xl/vbaProject.bin", "macro");
    const rejected = await parseMsrWorkbook(Buffer.from(await zip.generateAsync({ type: "nodebuffer" })));
    assert.equal(rejected.hasMacros, true);
    assert.equal(rejected.entries.length, 0);
  });

  it("reads the supplied workbook structurally without changing the file", async () => {
    const path = resolve("124190_SMS_EXL_JUN_2025.xlsx");
    const before = readFileSync(path);
    const digest = createHash("sha256").update(before).digest("hex");
    const parsed = await parseMsrWorkbook(before);
    const after = readFileSync(path);
    assert.equal(createHash("sha256").update(after).digest("hex"), digest);
    assert.equal(statSync(path).size, before.length);
    assert.equal(parsed.sheetName, "SubscriberReport");
    assert.equal(parsed.headersOk, true);
    assert.equal(parsed.entries.length > 0, true);
    assert.equal(parsed.entries.some(entry => Object.values(entry.weeklyCounts).includes(0)), true);
    assert.equal(parsed.entries.some(entry => entry.contractNumber === null), true);
    const formulaRows = parsed.entries.filter(entry => entry.formulas.day7 || entry.formulas.day14 || entry.formulas.day21 || entry.formulas.day28);
    assert.equal(formulaRows.length, 1);
    assert.equal(parsed.entries.every(entry => typeof entry.customerNumber === "string"), true);
  });
});
