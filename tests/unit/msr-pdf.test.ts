import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderMsrPdf } from "../../src/lib/admin/msr-pdf";
import type { MsrEntry } from "../../src/lib/admin/msr-types";

const entry = (weeklyCounts: MsrEntry["weeklyCounts"], formulas: MsrEntry["formulas"] = {}): MsrEntry => ({
  sourceRowNumber: 2, customerNumber: "00123", contractNumber: null, state: "GJ", subscriptionType: "Bouquet", channelName: "News", monthYear: "Jun-2025", weeklyCounts, formulas, issues: [], duplicateCandidate: false
});

describe("MSR PDF rendition", () => {
  it("preserves identifier text and the difference between blank and zero without adding totals", () => {
    const pdf = renderMsrPdf({ period: "2025-06", filename: "report.xlsx", entries: [entry({ day7: 0, day14: null, day21: 2, day28: null }, { day21: "1+1" })] }).toString("latin1");
    assert.match(pdf, /^%PDF-1\.4/);
    assert.match(pdf, /00123/);
    assert.match(pdf, /\(0\) Tj/);
    assert.equal(pdf.includes("(2*) Tj"), true);
    assert.equal(pdf.includes("active subscribers"), false);
    assert.equal(pdf.includes("Total"), false);
  });
});
