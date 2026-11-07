"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { modules } from "@/lib/modules";
import type { AdminResource } from "@/lib/admin/permissions";
import "@/styles/admin.css";

export function Workspace({ name, role, allowed, children }: { name: string; role: string; allowed: AdminResource[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() { await fetch("/api/admin/session", { method: "DELETE" }); router.replace("/admin"); router.refresh(); }
  const navigation = [{ slug: "dashboard", title: "Dashboard" }, ...modules];
  return <div className={`admin-shell staff-workspace ${open ? "mobile-open" : ""}`}><a className="skip-link" href="#main">Skip to content</a><aside className="admin-sidebar"><Brand /><p className="sidebar-group-title">Private workspace</p><nav className="admin-nav" aria-label="Staff navigation">{navigation.filter(item => allowed.includes(item.slug as AdminResource)).map(item => <Link key={item.slug} href={item.slug === "dashboard" ? "/admin" : `/admin/${item.slug}`} aria-current={pathname === (item.slug === "dashboard" ? "/admin" : `/admin/${item.slug}`) ? "page" : undefined} onClick={() => setOpen(false)}>{item.title}</Link>)}</nav><div className="sidebar-bottom"><p>{name}<br />{role}</p><button type="button" onClick={logout}>Sign out</button><Link href="/">Public website</Link></div></aside><div className="admin-body"><header className="admin-topbar"><div><button className="icon-button admin-mobile-toggle" aria-label={open ? "Close staff navigation" : "Open staff navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button><span>Lucky Cable · Management</span></div><span className="status-tag good">Private workspace</span></header><main id="main" className="admin-content">{children}</main></div></div>;
}
