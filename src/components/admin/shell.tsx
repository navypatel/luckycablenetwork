"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, PanelLeftClose, PanelLeftOpen, Menu, X, ChevronRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { modules, DashboardIcon } from "@/lib/modules";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const sidebar = document.getElementById("admin-navigation");
    const main = document.getElementById("main");
    const toggle = document.querySelector<HTMLButtonElement>(".admin-mobile-toggle");
    sidebar?.querySelector<HTMLElement>("nav a")?.focus();
    if (main) main.inert = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setMobileOpen(false); toggle?.focus(); }
      if (event.key === "Tab") {
        const targets = [...(sidebar?.querySelectorAll<HTMLElement>("a,button") ?? []), ...(toggle ? [toggle] : [])].filter(element => element.getClientRects().length > 0);
        const index = targets.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        targets[(index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length]?.focus();
      }
    }
    function handleResize() { if (innerWidth > 760) setMobileOpen(false); }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      if (main) main.inert = false;
      if (sidebar?.contains(document.activeElement)) toggle?.focus();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);
  const title = modules.find(module => pathname.endsWith(`/${module.slug}`))?.title ?? "Dashboard";
  return <div className={`admin-shell ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}><a className="skip-link" href="#main">Skip to content</a>
    <aside id="admin-navigation" className="admin-sidebar"><Brand /><div><p className="sidebar-group-title">Workspace</p><nav className="admin-nav" aria-label="Workspace navigation" onKeyDown={event => { if (event.key === "Escape") setMobileOpen(false); }}><Link href="/preview/admin" aria-label="Dashboard" aria-current={pathname === "/preview/admin" ? "page" : undefined} onClick={() => setMobileOpen(false)}><DashboardIcon aria-hidden="true" /><span className="nav-label">Dashboard</span></Link>{modules.map(module => <Link key={module.slug} href={`/preview/admin/${module.slug}`} aria-label={module.title} title={collapsed ? module.title : undefined} aria-current={pathname === `/preview/admin/${module.slug}` ? "page" : undefined} onClick={() => setMobileOpen(false)}><module.icon aria-hidden="true" /><span className="nav-label">{module.title}</span></Link>)}</nav></div><button className="collapse-control" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span className="nav-label">Collapse sidebar</span></button><div className="sidebar-bottom"><Link href="/">View public website <ArrowUpRight size={14} aria-hidden="true" /></Link><p>Design preview only.<br />No business data connected.</p></div></aside>
    <div className="admin-body"><header className="admin-topbar"><div><button className="icon-button admin-mobile-toggle" aria-label={mobileOpen ? "Close workspace navigation" : "Open workspace navigation"} aria-expanded={mobileOpen} aria-controls="admin-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button><span className="crumb">Workspace</span><ChevronRight size={14} aria-hidden="true" /><span>{title}</span></div><div><span className="preview-badge">Interface preview</span><span className="admin-avatar" aria-label="Preview mode, not a signed-in user">LC</span></div></header><main className="admin-content" id="main">{children}<footer className="admin-preview-footer"><span>Lucky Cable Daman · Management workspace</span><span>Preview only — not an authenticated staff session</span></footer></main></div>
  </div>;
}