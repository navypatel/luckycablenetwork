import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdminConfigured } from "@/lib/admin/config";
import { authorize } from "@/lib/admin/auth";
import { validMutationOrigin } from "@/lib/admin/origin";
import { connectDatabase } from "@/lib/admin/database";
import { MsrReport } from "@/lib/admin/models";
import { commitMsr, stageMsr } from "@/lib/admin/msr-service";
import { listRecords, createRecord, updateRecord } from "@/lib/admin/records";
import { renderMsrPdf } from "@/lib/admin/msr-pdf";
import { privateJson } from "@/lib/admin/response";
import type { AdminResource } from "@/lib/admin/permissions";

export const runtime = "nodejs";
const resources = new Set<AdminResource>(["dashboard", "msr", "customers", "cable-tv", "broadband", "channels", "racks", "billing", "support", "services", "reports", "users", "audit", "settings"]);

async function handle(request: NextRequest, path: string[], method: "GET" | "POST" | "PUT") {
  if (!isAdminConfigured()) return privateJson({ error: "Management storage is not configured." }, 503);
  const resource = path[0] as AdminResource;
  if (!resources.has(resource)) return privateJson({ error: "Not found." }, 404);
  if (method !== "GET" && !validMutationOrigin(request)) return privateJson({ error: "Origin not allowed." }, 403);
  try {
    const staff = await authorize(resource, method === "GET" ? "view" : method === "PUT" ? "update" : resource === "msr" ? "import" : ["users", "settings"].includes(resource) ? "manage" : "create");
    if (!staff) return privateJson({ error: "Authentication or permission required." }, 401);
    if (resource === "msr") return method === "PUT" ? privateJson({ error: "Not found." }, 404) : handleMsr(request, path, method, staff.id);
    if (["dashboard", "reports"].includes(resource)) return privateJson({ error: "Not found." }, 404);
    if (method === "GET" && path.length === 1) return privateJson(await listRecords(resource, request.nextUrl), 200);
    const kind = request.nextUrl.searchParams.get("kind") ?? "";
    const input = await request.json().catch(() => null);
    const result = method === "PUT" && path.length === 2 ? await updateRecord(resource, path[1], input, staff.id, kind) : method === "POST" && path.length === 1 ? await createRecord(resource, input, staff.id, kind) : { error: "Not found.", status: 404 };
    return privateJson(result, "error" in result ? Number(result.status) : method === "POST" ? 201 : 200);
  } catch (error) { if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) return privateJson({ error: "A record with this unique identifier already exists. No overwrite was made." }, 409); return privateJson({ error: "Management service is temporarily unavailable." }, 503); }
}

async function handleMsr(request: NextRequest, path: string[], method: "GET" | "POST", actorId: string) {
  if (method === "GET" && path.length === 1) {
    await connectDatabase();
    const page = Math.min(10000, Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1));
    const records = await MsrReport.find({}, "period filename sheetName sha256 status createdAt committedAt entries warnings").sort({ createdAt: -1 }).skip((page - 1) * 20).limit(20).lean();
    const total = await MsrReport.countDocuments();
    return privateJson({ records: records.map(record => ({ id: String(record._id), period: record.period, filename: record.filename, sheetName: record.sheetName, sha256: record.sha256, status: record.status, createdAt: record.createdAt, committedAt: record.committedAt, entries: record.entries.length, warnings: record.warnings })), page, total }, 200);
  }
  if (method === "POST" && path.length === 1) {
    const contentLength = Number(request.headers.get("content-length"));
    if (contentLength > 4 * 1024 * 1024) return privateJson({ error: "Upload exceeds the Vercel-safe 4 MB request limit." }, 413);
    const form = await request.formData();
    const file = form.get("file");
    const period = form.get("period"); const worksheet = form.get("worksheet");
    if (!(file instanceof File) || typeof period !== "string" || file.size > 3.5 * 1024 * 1024 || (worksheet !== null && typeof worksheet !== "string")) return privateJson({ error: "Provide a valid .xlsx file (up to 3.5 MB), reporting month, and optional worksheet name." }, 400);
    if (file.type && !["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream"].includes(file.type)) return privateJson({ error: "Unsupported file type." }, 415);
    const result = await stageMsr(Buffer.from(await file.arrayBuffer()), file.name, period, actorId, worksheet || undefined);
    return privateJson(result, "error" in result ? Number(result.status) : 201);
  }
  if (method === "GET" && path.length === 2 && mongoose.isValidObjectId(path[1])) {
    await connectDatabase();
    const report = await MsrReport.findById(path[1], "period filename sheetName sha256 status createdAt entries warnings").lean();
    return report ? privateJson({ id: String(report._id), period: report.period, filename: report.filename, sheetName: report.sheetName, sha256: report.sha256, status: report.status, createdAt: report.createdAt, entries: report.entries, warnings: report.warnings }, 200) : privateJson({ error: "Not found." }, 404);
  }
  if (method === "GET" && path.length === 3 && ["excel", "pdf"].includes(path[2]) && mongoose.isValidObjectId(path[1])) {
    const allowed = await authorize("msr", "export");
    if (!allowed) return privateJson({ error: "Permission required." }, 403);
    await connectDatabase();
    const report = await MsrReport.findById(path[1], "period filename source entries warnings").lean();
    if (!report) return privateJson({ error: "Not found." }, 404);
    const pdf = path[2] === "pdf";
    const body = pdf ? renderMsrPdf({ period: report.period, filename: report.filename, entries: report.entries, warnings: report.warnings }) : Buffer.from(report.source.buffer);
    const filename = pdf ? `MSR-${report.period}.pdf` : report.filename;
    return new NextResponse(body, { headers: { "Content-Type": pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="${filename.replace(/[^\w .()-]/g, "_")}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  }
  if (method === "POST" && path.length === 3 && path[2] === "commit" && mongoose.isValidObjectId(path[1])) {
    const allowed = await authorize("msr", "approve");
    if (!allowed) return privateJson({ error: "Permission required." }, 403);
    const result = await commitMsr(path[1], actorId);
    return privateJson(result, "error" in result ? Number(result.status) : 200);
  }
  return privateJson({ error: "Not found." }, 404);
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) { return handle(request, (await context.params).path, "GET"); }
export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) { return handle(request, (await context.params).path, "POST"); }
export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) { return handle(request, (await context.params).path, "PUT"); }