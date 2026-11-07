"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { broadcasters } from "@/lib/broadcasters";

export function BroadcasterCarousel() {
  const root = useRef<HTMLElement>(null);
  const activeIndex = useRef(0);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(true);
  const count = broadcasters.length;
  const current = broadcasters[index];
  const cardOffsets = [-1, 0, 1];
  const visibleCards = cardOffsets.map(offset => {
    const itemIndex = (index + offset + count) % count;
    return { item: broadcasters[itemIndex], itemIndex, offset, distance: Math.abs(offset) };
  });

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);

    let frame = 0;
    let visible = false;
    function update() {
      frame = 0;
      const element = root.current;
      if (!element || document.hidden || !visible || media.matches) return;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, element.offsetHeight - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      element.style.setProperty("--provider-progress", progress.toFixed(4));
      const next = Math.round(progress * (count - 1));
      if (next !== activeIndex.current) {
        activeIndex.current = next;
        setIndex(next);
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    if (root.current) observer.observe(root.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", sync);
      media.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [count]);

  function select(next: number) {
    const value = (next + count) % count;
    activeIndex.current = value;
    setIndex(value);
    const element = root.current;
    if (element && !reduced) {
      const travel = Math.max(1, element.offsetHeight - innerHeight);
      const pageTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: pageTop + travel * (value / (count - 1)), behavior: "instant" });
    }
  }

  return <section
    ref={root}
    className="broadcaster-section section-pad"
    role="region"
    aria-label="Provider image gallery"
    aria-roledescription="carousel"
    data-motion={reduced ? "reduced" : "scroll"}
  >
    <div className="broadcaster-sticky">
      <div className="section-heading">
        <h2>A world of channels.<br /><span className="muted">Turn your curiosity on.</span></h2>
        <p>Scroll to move through the provider gallery. Every featured provider is shown with its supplied image.</p>
      </div>
      <div className="provider-counter" aria-live="polite" aria-atomic="true">
        <span className="provider-count-current">{String(index + 1).padStart(2, "0")}</span>
        <span className="provider-count-rule" aria-hidden="true" />
        <span>{String(count).padStart(2, "0")}</span>
        <span className="provider-count-caption">PROVIDERS · IMAGE GALLERY</span>
      </div>
      <div className="provider-frame" data-testid="provider-frame" tabIndex={0} aria-label="Provider carousel. Center card is active; choose a side image, or use arrow keys, Home or End." onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        select(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
      }}>
        <div className="provider-carousel-stage" aria-label="Provider images, active item in the center">
          {visibleCards.map(({ item, itemIndex, offset, distance }) => <button
            key={item.name}
            type="button"
            className={`provider-image-surface theme-${item.theme}${offset === 0 ? " is-active" : ""}`}
            data-provider-slot={offset}
            style={{ "--provider-slot": offset, "--provider-distance": distance, zIndex: 5 - distance } as React.CSSProperties}
            aria-label={`Preview ${item.name}; select to feature`}
            aria-pressed={offset === 0}
            tabIndex={offset === 0 ? 0 : -1}
            onClick={() => select(itemIndex)}
          >
            <img src={item.image} alt="" loading={distance > 1 ? "lazy" : "eager"} />
          </button>)}
        </div>
        <div className="provider-detail">
          <div>
            <p className="provider-category">{current.category}</p>
            <h3>{current.name}</h3>
            <p className="provider-disclaimer">Images identify providers and channel partners only. This gallery does not confirm channel availability, package inclusion or subscription rights.</p>
          </div>
          <div className="provider-controls">
            <button className="icon-button" aria-label="Previous provider" onClick={() => select(index - 1)}><ArrowLeft size={19} aria-hidden="true" /></button>
            <button className="icon-button" aria-label="Next provider" onClick={() => select(index + 1)}><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <div className="provider-progress" aria-hidden="true"><span /></div>
      <div className="provider-footer">
        <span className="provider-scroll-hint"><ArrowDown size={15} aria-hidden="true" /> Scroll to change provider</span>
        <div className="provider-pagination" role="group" aria-label="Choose a provider">
          {broadcasters.map((provider, i) => <button key={provider.name} type="button" aria-label={`Show ${provider.name}`} aria-pressed={index === i} onClick={() => select(i)} />)}
        </div>
        <a className="text-link" href="/contact">Ask about channel availability <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </div>
  </section>;
}