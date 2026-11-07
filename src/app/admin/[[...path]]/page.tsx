import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/admin/login-form";
import { Workspace } from "@/components/admin/workspace";
import { MsrWorkspace } from "@/components/admin/msr-workspace";
import { OperationalWorkspace } from "@/components/admin/operational-workspace";
import { LiveDashboard } from "@/components/admin/live-dashboard";
import { isAdminConfigured } from "@/lib/admin/config";
import { currentStaff } from "@/lib/admin/auth";
import { can, type AdminResource } from "@/lib/admin/permissions";
import { modules } from "@/lib/modules";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Staff workspace", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StaffAccessPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const path = (await params).path ?? [];
  if (path.length > 1 || (path.length && !modules.some(module => module.slug === path[0]))) notFound();
  if (!isAdminConfigured()) return <main className="access-page"><Brand /><h1>Staff access is not configured.</h1><p>Set the private database connection and session secret to activate staff sign-in. Operational data is not exposed.</p><Link href="/preview/admin" className="button button-dark">View interface preview</Link><Link href="/" className="button button-outline">Back to website</Link></main>;
  let staff: Awaited<ReturnType<typeof currentStaff>>;
  try { staff = await currentStaff(); } catch { return <main className="access-page"><Brand /><h1>Management service unavailable.</h1><p>Database connection failed. Try again once the service is restored.</p></main>; }
  if (!staff) return <main className="access-page"><Brand /><h1>Staff sign in</h1><p>Private management workspace. Staff accounts are created by an administrator.</p><LoginForm /><Link href="/">Back to website</Link></main>;
  const resource = (path[0] ?? "dashboard") as AdminResource;
  if (!can(staff.role, resource, "view")) return <main className="access-page"><h1>Access denied</h1><p>Your role cannot view this module.</p><Link href="/admin">Return to workspace</Link></main>;
  const allowed = (["dashboard", ...modules.map(module => module.slug)] as AdminResource[]).filter(item => can(staff.role, item, "view"));
  const module = modules.find(item => item.slug === resource);
  const operational: AdminResource[] = ["customers", "cable-tv", "broadband", "channels", "racks", "billing", "support", "services", "users", "audit", "settings"];
  return <Workspace name={staff.name} role={staff.role} allowed={allowed}>{resource === "msr" ? <MsrWorkspace /> : resource === "dashboard" ? <LiveDashboard name={staff.name} role={staff.role} allowed={allowed} /> : operational.includes(resource) ? <OperationalWorkspace resource={resource} canCreate={can(staff.role, resource, ["settings", "users"].includes(resource) ? "manage" : "create")} /> : <><div className="admin-heading"><div><h1>{module?.title}</h1><p>{module?.description}</p></div></div><div className="workspace-panel"><h2>Read-only foundation</h2><p>{module?.needs}</p><p>No metric or user action is invented. This screen will activate only when its dedicated workflow is verified.</p></div></>}</Workspace>;
}