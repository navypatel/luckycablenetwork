"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Tv, Wifi, Radio } from "lucide-react";

const services = [
  { title: "Cable Television", text: "For the stories that bring everyone together.", href: "/services/cable-tv", label: "Explore cable TV", icon: Tv, className: "tv-art" },
  { title: "Broadband Internet", text: "A connection to work, play, and everything between.", href: "/services/broadband", label: "Explore broadband", icon: Wifi, className: "wifi-art" },
  { title: "Channel Information", text: "Find out what’s on, and what’s available to you.", href: "/services/cable-tv#channels", label: "View channel information", icon: Radio, className: "channel-art" }
];

export function ServiceCarousel() {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const destination = useRef<number | null>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  function go(index: number) {
    const next = Math.max(0, Math.min(services.length - 1, index));
    setActive(next);
    destination.current = next;
    const card = rail.current?.children[next] as HTMLElement | undefined;
    if (card && rail.current) rail.current.scrollTo({ left: card.offsetLeft - (rail.current.children[0] as HTMLElement).offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section className="services-section section-pad" aria-labelledby="services-heading">
    <div className="section-heading"><h2 id="services-heading">Your world.<br /><span className="muted">More connected.</span></h2><div><p>From the big screen to your next big idea.<br />Explore a different side of connection.</p><div className="carousel-controls"><button className="icon-button" aria-label="Previous service" disabled={active === 0} onClick={() => go(active - 1)}><ArrowLeft size={19} /></button><button className="icon-button" aria-label="Next service" disabled={active === services.length - 1} onClick={() => go(active + 1)}><ArrowRight size={19} /></button></div></div></div>
    <div className="service-rail" role="region" aria-label="Explore services" aria-roledescription="carousel" tabIndex={0} ref={rail}
      onKeyDown={e => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); go(e.key === "Home" ? 0 : e.key === "End" ? 2 : active + (e.key === "ArrowRight" ? 1 : -1)); } }}
      onWheel={() => { destination.current = null; }}
      onPointerDown={e => { destination.current = null; if (e.pointerType === "mouse" && e.button === 0) drag.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft, moved: false }; }}
      onPointerMove={e => { if (drag.current && e.buttons === 1) { const dx = e.clientX - drag.current.x; if (Math.abs(dx) > 6) { drag.current.moved = true; e.currentTarget.scrollLeft = drag.current.scroll - dx; } } }}
      onPointerUp={() => { setTimeout(() => { drag.current = null; }, 0); }} onPointerLeave={() => { drag.current = null; }}
      onClickCapture={e => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
      onScroll={e => { const children = [...e.currentTarget.children] as HTMLElement[]; const first = children[0].offsetLeft; if (destination.current !== null) { const distance = Math.abs(children[destination.current].offsetLeft - first - e.currentTarget.scrollLeft); if (distance < 3) destination.current = null; else return; } const nearest = children.reduce((best, child, i) => Math.abs(child.offsetLeft - first - e.currentTarget.scrollLeft) < Math.abs(children[best].offsetLeft - first - e.currentTarget.scrollLeft) ? i : best, 0); setActive(nearest); }}>
      {services.map((service, i) => <article key={service.title} className="service-card" aria-label={`${i + 1} of 3: ${service.title}`}><div className={`service-art ${service.className}`} aria-hidden="true"><div className="art-ring" /><div className="device"><service.icon size={68} strokeWidth={1.2} /></div><span className="art-word">{i === 0 ? "together." : i === 1 ? "possibilities." : "discover."}</span></div><div className="service-card-copy"><h3>{service.title}</h3><p>{service.text}</p><Link className="text-link" href={service.href} draggable={false}>{service.label} <ArrowUpRight size={18} aria-hidden="true" /></Link></div></article>)}
    </div>
    <div className="rail-footer"><span data-testid="carousel-status" aria-live="polite">{services[active].title} · {active + 1} of 3</span><span>Drag to explore <ArrowRight size={14} aria-hidden="true" /></span></div>
  </section>;
}