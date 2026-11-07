import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { directors, technologyPartners } from "@/lib/company";
export const metadata: Metadata = { title: "About us" };
export default function AboutPage() {
  return <>
    <section className="page-intro"><h1>Closer to the things<br />that make life, life.</h1><p>Meet the people and technology partners behind Lucky Cable Network. Connecting entertainment, broadband, and everyday life in Daman.</p></section>
    <section className="leadership section-pad" aria-labelledby="leadership-heading"><div className="section-heading"><h2 id="leadership-heading">People behind<br /><span className="muted">the connection.</span></h2><p>Our board brings experience in cable TV distribution, people management, administration, and business networking.</p></div><div className="director-grid">{directors.map((name, index) => <article className="director-profile" key={name}><div className="director-monogram" aria-hidden="true">{index === 0 ? "PP" : "NP"}<span /></div><div><h3>{name}</h3><p className="director-role">Non-Executive Director</p><p>More than 20 years of experience in Cable TV distribution, with expertise in people management, administration, and business networking.</p></div></article>)}</div></section>
    <section className="technology-partners section-pad" aria-labelledby="technology-heading"><div className="section-heading"><h2 id="technology-heading">Good connections.<br /><span className="muted">Built together.</span></h2><p>Our technology partners support the platforms behind cable distribution, viewing equipment, and subscriber management.</p></div><div className="technology-grid">{technologyPartners.map(group => <section key={group.category} className="technology-group"><h3>{group.category}</h3><p>{group.description}</p><ul>{group.names.map((name, i) => <li key={name}><span>{name}</span>{group.details[i] && <small>{group.details[i]}</small>}</li>)}</ul></section>)}</div><Link className="text-link" href="/services/cable-tv">Explore cable television <ArrowUpRight size={18} aria-hidden="true" /></Link></section>
  </>;
}