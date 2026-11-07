import { createHash } from "node:crypto";
import { connectDatabase } from "./database";
import { AdminAudit, MsrReport } from "./models";
import { parseMsrWorkbook } from "./msr-parser";
import { withinMsrDocumentBudget } from "./msr-size";

const periodPattern = /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])$/;

export async function stageMsr(bytes: Buffer, filename: string, period: string, actorId: string, worksheet?: string) {
  if (!periodPattern.test(period)) return { error: "Choose a valid reporting month (YYYY-MM).", status: 400 };
  if (!/^[\w .()-]{1,120}\.xlsx$/i.test(filename)) return { error: "Upload an .xlsx file with a safe filename.", status: 400 };
  const parsed = await parseMsrWorkbook(bytes, worksheet?.trim() || undefined);
  if (parsed.errors.length || !parsed.headersOk) return { error: "Workbook validation failed.", details: parsed.errors, status: 422 };
  if (parsed.entries.length === 0) return { error: "Workbook contains no report rows.", status: 422 };
  if (!withinMsrDocumentBudget(bytes.length, parsed.entries)) return { error: "Workbook and parsed rows exceed the safe MongoDB document budget.", status: 413 };
  // The workbook period cell's format is not yet an approved validation contract; show raw values in preview instead of guessing.
  if (parsed.entries.some(entry => entry.issues.some(issue => issue.level === "error"))) return { error: "Workbook rows have validation errors.", status: 422 };
  await connectDatabase();
  const existing = await MsrReport.findOne({ sha256: parsed.sha256 }).select("_id status").lean();
  if (existing) return { error: "This exact workbook was already staged or imported.", id: String(existing._id), status: 409 };
  const conflict = await MsrReport.exists({ period, status: "imported" });
  if (conflict) return { error: "This reporting period already has an imported version. No overwrite was made.", status: 409 };
  const report = await MsrReport.create({ sha256: parsed.sha256, filename, period, sheetName: parsed.sheetName, source: bytes, entries: parsed.entries, warnings: parsed.warnings, createdBy: actorId, status: "staged" });
  await AdminAudit.create({ actorId, action: "msr.stage", target: String(report._id) });
  return { id: String(report._id), status: "staged", entries: parsed.entries.length, warnings: parsed.warnings, duplicateCandidates: parsed.entries.filter(entry => entry.duplicateCandidate).length };
}

export async function commitMsr(id: string, actorId: string) {
  await connectDatabase();
  const report = await MsrReport.findById(id);
  if (!report) return { error: "Report not found.", status: 404 };
  if (report.status !== "staged") return { error: "This report is no longer staged.", status: 409 };
  const conflict = await MsrReport.exists({ period: report.period, status: "imported", _id: { $ne: report._id } });
  if (conflict) return { error: "An imported report already exists for this period.", status: 409 };
  const updated = await MsrReport.updateOne({ _id: id, status: "staged" }, { $set: { status: "imported", committedBy: actorId, committedAt: new Date() } });
  if (updated.modifiedCount !== 1) return { error: "Report state changed. Refresh and try again.", status: 409 };
  await AdminAudit.create({ actorId, action: "msr.commit", target: id });
  return { id, status: "imported" };
}

export function hashReport(bytes: Buffer) { return createHash("sha256").update(bytes).digest("hex"); }
