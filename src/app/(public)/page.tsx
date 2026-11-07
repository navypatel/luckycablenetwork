import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight, Cable, Wifi, Tv } from "lucide-react";
import { SignalScene } from "@/components/public/signal-scene";
import { ServiceCarousel } from "@/components/public/service-carousel";
import { BroadcasterCarousel } from "@/components/public/broadcaster-carousel";
import { ConnectionCinema } from "@/components/public/connection-cinema";

export default function HomePage() {
  return <>
    <section className="hero"><div className="hero-copy"><h1>Life happens.<br />Stay <span className="connected-word">connected<svg viewBox="0 0 520 22" aria-hidden="true"><path d="M4 15 Q245 -6 516 12" /></svg></span>.</h1><p>Movie nights. New ideas. Everyday conversations.<br className="desktop-break" /> Make room for what matters with Lucky Cable Daman.</p><div className="hero-actions"><Link href="/services" className="button button-dark">Explore services <ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/packages" className="button button-outline">Find your connection <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="hero-note"><span className="little-dot" /> Cable television & broadband</div></div><SignalScene /><a href="#experience" className="scroll-cue">A world worth connecting <ArrowDown size={16} aria-hidden="true" /></a></section>
    <div className="connection-strip" aria-hidden="true"><span><Tv size={20} /> Entertainment</span><span className="strip-star">✳</span><span><Wifi size={20} /> Possibilities</span><span className="strip-star">✳</span><span><Cable size={20} /> Connection</span><span className="strip-star">✳</span><span>Closer to home.</span></div>
    <ServiceCarousel />
    <ConnectionCinema />
    <BroadcasterCarousel />
    <section className="experience section-pad" id="experience"><div className="experience-copy"><h2>Not just a signal.<br /><span>Part of your day.</span></h2><p>The match everyone’s watching. The idea you can’t wait to share. The familiar voice on the other side of the screen.</p><p>Connection is about what happens next.</p><Link href="/about" className="text-link">Meet Lucky Cable <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="day-composition" aria-label="An original illustration connecting entertainment, ideas, and home"><div className="day-window window-entertainment"><Tv size={28} aria-hidden="true" /><span>One more episode?</span><div className="screen-landscape" /></div><div className="day-window window-ideas"><MoveUpRight size={36} aria-hidden="true" /><span>Your next<br />big idea.</span></div><div className="day-line" /><div className="day-label">Made for the moments in between.</div></div></section>
    <section className="package-banner section-pad"><div><h2>A connection<br />that fits your world.</h2><p>Explore advertised broadband plans from 50 to 200 Mbps.<br className="desktop-break" /> Confirm current terms and availability before subscribing.</p></div><Link href="/packages" className="button button-dark">Explore package information <ArrowUpRight size={18} aria-hidden="true" /></Link></section>
    <section className="closing section-pad"><h2>Let’s get<br /><span>connected.</span></h2><div><p>Have a question about cable TV or broadband?<br />Start with what matters to you.</p><Link href="/contact" className="round-link" aria-label="Go to contact page"><ArrowUpRight size={34} aria-hidden="true" /></Link></div></section>
  </>;
}