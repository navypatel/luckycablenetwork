import { z } from "zod";
const text = (max = 160) => z.string().trim().min(1).max(max);
const optional = (max = 500) => z.string().trim().max(max).optional().default("");
const id = z.string().regex(/^[a-f\d]{24}$/i);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const inputs = {
  customers: z.object({ customerNumber: text(80), name: text(), phone: optional(30), email: z.union([z.literal(""), z.email().max(254)]).optional().default(""), address: optional(), notes: optional(1000) }),
  catalogue: z.object({ code: text(80), name: text(), description: optional(), pricePaise: z.number().int().nonnegative().optional(), termMonths: z.number().int().min(1).max(120).optional(), speedMbps: z.number().int().min(1).optional(), active: z.boolean().default(true) }),
  subscriptions: z.object({ customerId: id, catalogueId: id, contractNumber: text(80), connectionIdentifier: optional(100), status: z.enum(["pending", "active", "suspended", "closed"]), effectiveFrom: date, effectiveTo: z.union([z.literal(""), date]).optional().default(""), notes: optional(1000) }),
  channels: z.object({ code: text(80), name: text(), category: optional(100), provider: optional(), notes: optional(1000) }),
  racks: z.object({ code: text(80), name: text(), location: optional(200), notes: optional(1000) }),
  assignments: z.object({ channelId: id, rackId: id, effectiveFrom: date, effectiveTo: z.union([z.literal(""), date]).optional().default(""), notes: optional(1000) }),
  invoices: z.object({ invoiceNumber: text(80), customerId: id, issueDate: date, dueDate: z.union([z.literal(""), date]).optional().default(""), description: text(500), amountPaise: z.number().int().positive(), status: z.enum(["draft", "issued", "paid", "cancelled"]) }),
  payments: z.object({ invoiceId: id, reference: text(100), paidOn: date, amountPaise: z.number().int().positive(), method: text(80) }),
  support: z.object({ ticketNumber: text(80), customerId: id, category: text(100), description: text(2000), status: z.enum(["open", "in-progress", "resolved", "closed"]), priority: z.enum(["low", "normal", "high", "urgent"]), notes: optional(2000) }),
  settings: z.object({ key: text(80).regex(/^[a-z][a-z0-9.-]*$/), value: z.string().max(4000) }),
  users: z.object({ email: z.email().max(254), displayName: text(160), role: z.enum(["Super Admin", "Management", "Accounts", "Operations", "Support", "Report Viewer"]), password: z.string().min(16).max(1024) })
};
