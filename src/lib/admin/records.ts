import { connectDatabase } from "./database";
import bcrypt from "bcryptjs";
import { Customer, ServiceCatalogue, Subscription, Channel, Rack, RackPosition, RackAssignment, Invoice, Payment, Complaint, StaffUser, CompanySetting, AdminAudit, PublicEnquiry } from "./models";
import { audit } from "./audit";
import { paging } from "./text";
import { inputs } from "./record-input";
import type { AdminResource } from "./permissions";

const moduleMap = { "cable-tv": "cable-tv", broadband: "broadband", services: "services" } as const;
const projection = "-passwordHash -source -tokenHash -sourceHash";
export function safeRecord(record: Record<string, any>, hideAuditValues = false) {
  const { _id, __v, passwordHash, tokenHash, source, before, after, ...safe } = record;
  if (!hideAuditValues && before !== undefined) safe.before = before;
  if (!hideAuditValues && after !== undefined) safe.after = after;
  return { ...safe, id: String(_id) };
}
const plain = (record: Record<string, unknown>, hideAuditValues = false) => safeRecord(record, hideAuditValues);

function target(resource: AdminResource, kind: string) {
  if (resource === "customers") return { model: Customer, schema: inputs.customers, extra: {} };
  if (resource in moduleMap && kind === "subscriptions") return { model: Subscription, schema: inputs.subscriptions, extra: { module: moduleMap[resource as keyof typeof moduleMap] } };
  if (resource in moduleMap) return { model: ServiceCatalogue, schema: inputs.catalogue, extra: { module: moduleMap[resource as keyof typeof moduleMap] } };
  if (resource === "channels") return { model: Channel, schema: inputs.channels, extra: {} };
  if (resource === "racks" && kind === "positions") return { model: RackPosition, schema: inputs.assignments, extra: {} };
  if (resource === "racks" && kind === "assignments") return { model: RackAssignment, schema: inputs.assignments, extra: {} };
  if (resource === "racks") return { model: Rack, schema: inputs.racks, extra: {} };
  if (resource === "billing" && kind === "payments") return { model: Payment, schema: inputs.payments, extra: {} };
  if (resource === "billing") return { model: Invoice, schema: inputs.invoices, extra: {} };
  if (resource === "support" && kind === "enquiries") return { model: PublicEnquiry, schema: null, extra: {} };
  if (resource === "support") return { model: Complaint, schema: inputs.support, extra: {} };
  if (resource === "settings") return { model: CompanySetting, schema: inputs.settings, extra: {} };
  if (resource === "users") return { model: StaffUser, schema: inputs.users, extra: {} };
  return null;
}

export async function listRecords(resource: AdminResource, url: URL) {
  await connectDatabase();
  const { page, q, skip, limit } = paging(url); const kind = url.searchParams.get("kind") ?? "";
  let model: any = target(resource, kind)?.model; const filter: Record<string, any> = {};
  if (resource in moduleMap) filter.module = moduleMap[resource as keyof typeof moduleMap];
  if (resource === "users") model = StaffUser;
  if (resource === "audit") model = AdminAudit;
  if (!model) return { records: [], total: 0, page };
  if (q) filter.$or = ["code", "name", "email", "interest", "message", "deliveryStatus", "rackCode", "channel", "status", "customerNumber", "invoiceNumber", "ticketNumber", "reference", "key", "action", "target"].map(field => ({ [field]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }));
  const sort = resource === "racks" && kind === "positions" ? { rackCode: 1, slot: 1 } : { createdAt: -1, at: -1 };
  const [records, total] = await Promise.all([model.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(), model.countDocuments(filter)]);
  return { records: records.map((record: Record<string, unknown>) => plain(record, resource === "audit")), total, page };
}

export async function createRecord(resource: AdminResource, input: unknown, actorId: string, kind = "") {
  await connectDatabase(); const selected = target(resource, kind);
  if (!selected || !selected.schema || (resource === "racks" && kind === "positions")) return { error: "Creation is not supported for this resource.", status: 405 };
  const parsed = selected.schema.safeParse(input);
  if (!parsed.success) return { error: "Check the record fields.", details: parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`), status: 400 };
  let data: Record<string, unknown> = { ...parsed.data, ...selected.extra };
  if (resource === "users") { const { password, ...staff } = data as Record<string, any>; data = { ...staff, email: String(staff.email).toLowerCase(), passwordHash: await bcrypt.hash(password, 12), active: true }; }
  const record = await selected.model.create(resource === "users" ? data : { ...data, createdBy: actorId, updatedBy: actorId });
  const auditData = resource === "users" ? { email: data.email, displayName: data.displayName, role: data.role, active: true } : data;
  await audit(actorId, `${resource}.create`, String(record._id), undefined, auditData);
  return { record: plain(record.toObject(), resource === "users") };
}

export async function updateRecord(resource: AdminResource, recordId: string, input: unknown, actorId: string, kind = "") {
  await connectDatabase(); const selected = target(resource, kind);
  if (!selected || !selected.schema || !/^[a-f\d]{24}$/i.test(recordId) || resource === "users") return { error: "Update is not supported for this record.", status: 405 };
  const parsed = selected.schema.safeParse(input);
  if (!parsed.success) return { error: "Check the record fields.", details: parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`), status: 400 };
  const before = await selected.model.findById(recordId, projection).lean();
  if (!before) return { error: "Record not found.", status: 404 };
  const data = { ...parsed.data, ...selected.extra, updatedBy: actorId };
  const record = await selected.model.findByIdAndUpdate(recordId, { $set: data }, { returnDocument: "after", runValidators: true }).lean();
  await audit(actorId, `${resource}.update`, recordId, before, data);
  return { record: plain(record, resource === "settings") };
}

