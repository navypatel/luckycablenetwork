"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content is visible without JS; only enter animations use WAAPI. */
export function ScrollMotion() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.querySelector(".public-site #main");
    if (!main) return;
    const animations: Animation[] = [];
    let frame = 0;
    const targets = main.querySelectorAll<HTMLElement>(".section-heading, .experience, .package-banner, .closing, .director-profile, .technology-group, .contact-method, .broadband-plan, .partner-channels, .page-intro");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.dataset.revealed = "true";
        observer.unobserve(el);
        if (media.matches || !el.animate) continue;
        const children = el.matches(".experience, .closing") ? [...el.children] : [el];
        children.forEach((child, i) => animations.push(child.animate([
          { opacity: .2, transform: `translate3d(${el.matches(".technology-group") ? "18px" : "0"}, ${el.matches(".section-heading") ? "32px" : "22px"}, 0)` },
          { opacity: 1, transform: "translate3d(0,0,0)" }
        ], { duration: 800, delay: Math.min(i * 100, 250), easing: "cubic-bezier(.16,1,.3,1)" })));
      }
    }, { threshold: .12, rootMargin: "0px 0px -24px 0px" });
    targets.forEach(el => observer.observe(el));
    const experience = main.querySelector<HTMLElement>(".experience");
    const composition = main.querySelector<HTMLElement>(".day-composition");
    function update() {
      frame = 0;
      if (document.hidden) return;
      const total = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
      if (!composition || !experience) return;
      if (media.matches) { composition.style.removeProperty("--scroll-depth"); return; }
      const box = experience.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const fraction = Math.max(-1, Math.min(1, (innerHeight / 2 - (box.top + box.height / 2)) / innerHeight));
      composition.style.setProperty("--scroll-depth", `${fraction * 65}px`);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function preferenceChange() { if (media.matches) animations.forEach(animation => animation.cancel()); schedule(); }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", preferenceChange);
    document.addEventListener("visibilitychange", schedule);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); media.removeEventListener("change", preferenceChange); document.removeEventListener("visibilitychange", schedule); composition?.style.removeProperty("--scroll-depth"); };
  }, [pathname]);
  return <div ref={progress} className="page-progress" aria-hidden="true" />;
}