import mongoose, { Schema } from "mongoose";

export const staffRoles = ["Super Admin", "Management", "Accounts", "Operations", "Support", "Report Viewer"] as const;
export type StaffRole = typeof staffRoles[number];

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  displayName: { type: String, required: true },
  role: { type: String, enum: staffRoles, required: true },
  active: { type: Boolean, default: true, required: true },
  sessionVersion: { type: Number, default: 0, required: true }
}, { timestamps: true, strict: "throw" });

const SessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "StaffUser", required: true, index: true },
  sessionVersion: { type: Number, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true, strict: "throw" });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuditSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: "StaffUser" },
  action: { type: String, required: true },
  target: { type: String, required: true },
  before: { type: Schema.Types.Mixed }, after: { type: Schema.Types.Mixed },
  at: { type: Date, default: Date.now, required: true }
}, { strict: "throw" });

export const StaffUser = mongoose.models.StaffUser || mongoose.model("StaffUser", UserSchema);
export const StaffSession = mongoose.models.StaffSession || mongoose.model("StaffSession", SessionSchema);
export const AdminAudit = mongoose.models.AdminAudit || mongoose.model("AdminAudit", AuditSchema);

const LoginAttemptSchema = new Schema({ key: { type: String, required: true, unique: true }, failures: { type: Number, default: 0 }, blockedUntil: { type: Date }, updatedAt: { type: Date, default: Date.now } }, { strict: "throw" });
LoginAttemptSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });
export const LoginAttempt = mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", LoginAttemptSchema);

const MsrReportSchema = new Schema({
  sha256: { type: String, required: true, unique: true }, filename: { type: String, required: true }, period: { type: String, required: true },
  sheetName: { type: String, required: true }, source: { type: Buffer, required: true },
  entries: { type: [Schema.Types.Mixed], default: [] }, warnings: { type: [String], default: [] },
  status: { type: String, enum: ["staged", "imported"], default: "staged", required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true }, committedBy: { type: Schema.Types.ObjectId }, committedAt: { type: Date }
}, { timestamps: true, strict: "throw" });
MsrReportSchema.index({ period: 1 }, { unique: true, partialFilterExpression: { status: "imported" } });

const auditFields = {
  createdBy: { type: Schema.Types.ObjectId, ref: "StaffUser", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "StaffUser", required: true }
};

const CustomerSchema = new Schema({
  customerNumber: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true }, email: { type: String, trim: true, lowercase: true }, address: { type: String, trim: true },
  notes: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });
CustomerSchema.index({ customerNumber: "text", name: "text", phone: "text", email: "text" });

const CatalogueSchema = new Schema({
  module: { type: String, enum: ["cable-tv", "broadband", "services"], required: true, index: true },
  code: { type: String, required: true, trim: true }, name: { type: String, required: true, trim: true },
  description: { type: String, trim: true }, pricePaise: { type: Number, min: 0 }, termMonths: { type: Number, min: 1, max: 120 }, speedMbps: { type: Number, min: 1 },
  active: { type: Boolean, default: true, required: true }, ...auditFields
}, { timestamps: true, strict: "throw" });
CatalogueSchema.index({ module: 1, code: 1 }, { unique: true });

const SubscriptionSchema = new Schema({
  module: { type: String, enum: ["cable-tv", "broadband", "services"], required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  catalogueId: { type: Schema.Types.ObjectId, ref: "ServiceCatalogue", required: true },
  contractNumber: { type: String, required: true, trim: true }, connectionIdentifier: { type: String, trim: true },
  status: { type: String, enum: ["pending", "active", "suspended", "closed"], default: "pending", required: true },
  effectiveFrom: { type: String, required: true }, effectiveTo: { type: String }, notes: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });
SubscriptionSchema.index({ module: 1, contractNumber: 1 }, { unique: true });

const ChannelSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true }, name: { type: String, required: true, trim: true },
  category: { type: String, trim: true }, provider: { type: String, trim: true }, notes: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });

const RackSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true }, name: { type: String, required: true, trim: true },
  location: { type: String, trim: true }, notes: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });

const RackPositionSchema = new Schema({
  rackCode: { type: String, required: true, trim: true, index: true },
  slot: { type: Number, required: true, min: 1, max: 200 },
  channel: { type: String, default: null, trim: true },
  status: { type: String, enum: ["assigned", "blank", "unconfirmed"], required: true },
  source: { type: String, required: true, default: "management-supplied" },
  ...auditFields
}, { timestamps: true, strict: "throw" });
RackPositionSchema.index({ rackCode: 1, slot: 1 }, { unique: true });


export const MsrReport = mongoose.models.MsrReport || mongoose.model("MsrReport", MsrReportSchema);

const RackAssignmentSchema = new Schema({
  channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true, index: true }, rackId: { type: Schema.Types.ObjectId, ref: "Rack", required: true, index: true },
  effectiveFrom: { type: String, required: true }, effectiveTo: { type: String }, notes: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });
RackAssignmentSchema.index({ channelId: 1, rackId: 1, effectiveFrom: 1 }, { unique: true });

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true, trim: true }, customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  issueDate: { type: String, required: true }, dueDate: { type: String }, description: { type: String, required: true, trim: true },
  amountPaise: { type: Number, required: true, min: 1 }, status: { type: String, enum: ["draft", "issued", "paid", "cancelled"], default: "draft", required: true }, ...auditFields
}, { timestamps: true, strict: "throw" });

const PaymentSchema = new Schema({
  invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true }, reference: { type: String, required: true, unique: true, trim: true },
  paidOn: { type: String, required: true }, amountPaise: { type: Number, required: true, min: 1 }, method: { type: String, required: true, trim: true },
  reversedAt: { type: Date }, reversalReason: { type: String, trim: true }, ...auditFields
}, { timestamps: true, strict: "throw" });

const ComplaintSchema = new Schema({
  ticketNumber: { type: String, required: true, unique: true, trim: true }, customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  category: { type: String, required: true, trim: true }, description: { type: String, required: true, trim: true },
  status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open", required: true },
  priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "StaffUser" }, notes: { type: String, trim: true }, resolvedAt: { type: Date }, ...auditFields
}, { timestamps: true, strict: "throw" });

const CompanySettingSchema = new Schema({ key: { type: String, required: true, unique: true, trim: true }, value: { type: String, required: true }, ...auditFields }, { timestamps: true, strict: "throw" });

export const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export const ServiceCatalogue = mongoose.models.ServiceCatalogue || mongoose.model("ServiceCatalogue", CatalogueSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
export const Channel = mongoose.models.Channel || mongoose.model("Channel", ChannelSchema);
export const Rack = mongoose.models.Rack || mongoose.model("Rack", RackSchema);
export const RackPosition = mongoose.models.RackPosition || mongoose.model("RackPosition", RackPositionSchema);
export const RackAssignment = mongoose.models.RackAssignment || mongoose.model("RackAssignment", RackAssignmentSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
export const CompanySetting = mongoose.models.CompanySetting || mongoose.model("CompanySetting", CompanySettingSchema);
