"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";

// Placeholder stats — replace with real studio figures before launch.
const stats = [
  { value: 500, suffix: "+", label: "Sessions" },
  { value: 100, suffix: "+", label: "Artists" },
  { value: 1000, suffix: "+", label: "Tracks" },
  { value: 5, suffix: "+", label: "Years" }
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      start = Math.floor(progress * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl text-paper">
      {display}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-28 px-6 bg-ink">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">About us</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-8">
            BUILT FOR ARTISTS
          </h2>
          <p className="text-mist max-w-2xl text-lg leading-relaxed mb-16">
            [STUDIO STORY] — Krazy Music Studio is a room built around one idea: your sound
            deserves better than a rough mix. Replace this placeholder with the studio&apos;s
            real story, equipment list, and what makes the space distinct.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-center md:text-left">
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-1 text-sm text-mist uppercase tracking-wide">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
