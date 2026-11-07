import type { StaffRole } from "./models";

const resources = ["dashboard", "msr", "customers", "cable-tv", "broadband", "channels", "racks", "billing", "support", "services", "reports", "users", "audit", "settings"] as const;
export type AdminResource = typeof resources[number];
export type AdminAction = "view" | "create" | "update" | "import" | "export" | "approve" | "amend" | "archive" | "manage";

/** Provisional matrix from LUCKY_CABLE_REQUIREMENTS.md section 10. Management can revisit grants. */
const view: Record<StaffRole, readonly AdminResource[]> = {
  "Super Admin": resources,
  Management: resources.filter(resource => resource !== "users" && resource !== "settings"),
  Accounts: ["dashboard", "customers", "billing", "reports"],
  Operations: ["dashboard", "customers", "cable-tv", "broadband", "channels", "racks", "support"],
  Support: ["dashboard", "customers", "support"],
  "Report Viewer": ["dashboard", "msr", "reports"]
};

const writes: Record<StaffRole, Partial<Record<AdminResource, readonly AdminAction[]>>> = {
  "Super Admin": Object.fromEntries(resources.map(resource => [resource, ["create", "update", "import", "export", "approve", "amend", "archive", "manage"]])) as Record<AdminResource, AdminAction[]>,
  Management: { msr: ["import", "export", "approve"], reports: ["export"] },
  Accounts: { billing: ["create", "update", "export"], reports: ["export"] },
  Operations: { customers: ["create", "update"], "cable-tv": ["create", "update"], broadband: ["create", "update"], channels: ["create", "update"], racks: ["create", "update"] },
  Support: { support: ["create", "update"] },
  "Report Viewer": { msr: ["export"], reports: ["export"] }
};

export function can(role: StaffRole, resource: AdminResource, action: AdminAction) {
  if (!resources.includes(resource)) return false;
  if (action === "view") return view[role].includes(resource);
  return writes[role][resource]?.includes(action) ?? false;
}
