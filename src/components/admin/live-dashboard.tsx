import Link from "next/link";
import { dashboardMetrics } from "@/lib/admin/analytics";
import { modules } from "@/lib/modules";
import type { AdminResource } from "@/lib/admin/permissions";
const names: Record<string, string> = { customers: "Customers", subscriptions: "Subscriptions", invoices: "Invoices", payments: "Payments", openComplaints: "Open complaints", stagedReports: "Staged MSR reports", importedReports: "Imported MSR reports" };
export async function LiveDashboard({ name, role, allowed }: { name: string; role: string; allowed: AdminResource[] }) {
  const data = await dashboardMetrics();
  return <><div className="admin-heading"><div><h1>Welcome, {name}</h1><p>Private staff workspace · {role}</p></div></div><div className="admin-notice">Every number below is calculated from persisted MongoDB records. An empty value means zero saved records.</div><section className="metric-grid" aria-label="Operational summary">{Object.entries(data.metrics).map(([key, value]) => <article className="workspace-panel" key={key}><span>{names[key]}</span><strong>{value}</strong></article>)}</section><div className="admin-overview"><section className="workspace-panel"><h2>Recent activity</h2>{data.recentAudit.length === 0 ? <p>No administrative activity recorded.</p> : <ul className="audit-list">{data.recentAudit.map(event => <li key={event.id}><strong>{event.action}</strong><span>{new Date(event.at).toLocaleString("en-IN")}</span></li>)}</ul>}</section><section className="workspace-panel"><h2>Authorized modules</h2>{allowed.filter(item => item !== "dashboard").map(slug => <Link className="dashboard-module-link" key={slug} href={`/admin/${slug}`}>{modules.find(item => item.slug === slug)?.title}</Link>)}</section></div></>;
}
