"use client";

import { useEffect, useRef, useState } from "react";
import { Laptop, Play, Radio, Pause, Wifi } from "lucide-react";

export function SignalScene() {
  const scene = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let visible = true;
    const update = () => scene.current?.classList.toggle("scene-sleeping", !visible || document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (scene.current) observer.observe(scene.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div className={`signal-scene ${paused ? "paused" : ""}`} ref={scene} onPointerMove={e => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty("--tilt-x", `${(e.clientX - box.left - box.width / 2) / 40}deg`);
    scene.current?.style.setProperty("--tilt-y", `${-(e.clientY - box.top - box.height / 2) / 40}deg`);
  }} onPointerLeave={() => { scene.current?.style.setProperty("--tilt-x", "0deg"); scene.current?.style.setProperty("--tilt-y", "0deg"); }}>
    <div className="scene-grid" aria-hidden="true" />
    <div className="signal-sculpture" aria-hidden="true">
      <div className="signal-orbit orbit-one" /><div className="signal-orbit orbit-two" /><div className="signal-orbit orbit-three" />
      <div className="signal-core"><Wifi size={70} strokeWidth={1.4} /></div>
      <div className="satellite satellite-tv"><Play size={24} fill="currentColor" /><span>Press play.</span></div>
      <div className="satellite satellite-work"><Laptop size={24} /><span>Make it happen.</span></div>
      <div className="satellite satellite-home"><Radio size={20} /><span>Feel connected.</span></div>
      <div className="signal-dot dot-one" /><div className="signal-dot dot-two" />
    </div>
    <span className="scene-caption">A little connection. A whole new world.</span>
    <button className="motion-toggle" aria-label={paused ? "Play ambient animation" : "Pause ambient animation"} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button>
  </div>;
}