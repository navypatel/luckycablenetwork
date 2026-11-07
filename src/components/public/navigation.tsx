"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { company, phoneHref } from "@/lib/company";

const links = [["/", "Home"], ["/about", "About us"], ["/services", "Services"], ["/packages", "Packages"], ["/contact", "Contact"]];

export function PublicHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="public-header">
    <Brand />
    <button className="icon-button mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="public-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="public-nav" aria-label="Main navigation" className={open ? "public-nav is-open" : "public-nav"} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}>
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
    </nav>
    <Link className="button button-dark header-cta" href="/contact">Let’s connect <ArrowUpRight size={17} aria-hidden="true" /></Link>
  </header>;
}

export function PublicFooter() {
  return <footer className="public-footer">
    <div className="footer-top"><Brand /><p>A world of possibilities.<br />A connection closer to home.</p><Link href="/contact" className="text-link">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <div className="footer-contact"><a href={phoneHref(company.cablePhone)}>Cable TV · {company.cablePhone}</a><a href={phoneHref(company.broadbandPhone)}>Broadband · {company.broadbandPhone}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
    <div className="footer-bottom"><span>Lucky Cable Daman</span><span>Website preview · Online account services coming later</span><Link href="/admin">Staff access <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
  </footer>;
}