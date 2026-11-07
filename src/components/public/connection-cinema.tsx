"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Home, Radio, Tv, Wifi } from "lucide-react";

/** A scroll-scrubbed scene, not scroll hijacking. Static assembled fallback without JS. */
export function ConnectionCinema() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      if (!element || document.hidden) return;
      if (motion.matches) { element.style.setProperty("--assembly", "1"); element.dataset.motion = "static"; return; }
      element.dataset.motion = "scroll";
      if (!visible) return;
      const box = element.getBoundingClientRect();
      const distance = Math.max(1, box.height - innerHeight);
      const progress = Math.max(0, Math.min(1, -box.top / distance));
      element.style.setProperty("--assembly", progress.toFixed(4));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", schedule); motion.removeEventListener("change", schedule); };
  }, []);

  return <section ref={root} className="connection-cinema" role="region" aria-label="A connection, layer by layer">
    <div className="cinema-sticky">
      <div className="cinema-heading"><h2>A little signal.<br /><span>A whole world.</span></h2><p>Entertainment. Possibility. Home.<br />Watch the layers come together.</p></div>
      <div className="cinema-world" aria-hidden="true">
        <div className="cinema-plane plane-sky"><div className="cinema-sun" /><div className="sky-orbit" /><span className="plane-label"><Radio size={16} /> The signal</span></div>
        <div className="cinema-plane plane-network"><svg viewBox="0 0 800 450" preserveAspectRatio="none"><path d="M-20 310 Q160 80 340 245 T820 175" /><path d="M-20 350 Q190 160 390 290 T820 215" /><path d="M-20 390 Q220 210 430 340 T820 260" /></svg><span className="network-node node-a"/><span className="network-node node-b"/><span className="network-node node-c"/><span className="plane-label"><Wifi size={16} /> The connection</span></div>
        <div className="cinema-plane plane-home"><div className="cinema-hills hill-back"/><div className="cinema-hills hill-front"/><div className="cinema-house"><div className="house-roof"/><div className="house-wall"><div className="house-window"><Tv size={25} /></div><div className="house-door"/></div></div><span className="plane-label"><Home size={16} /> Your world</span></div>
      </div>
      <div className="cinema-bottom"><span className="cinema-scroll"><ArrowDown size={16} aria-hidden="true" /> Scroll to bring it together</span><Link href="/services" className="text-link">Explore the connection <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div>
  </section>;
}