"use client";

import Reveal from "./Reveal";
import { Star } from "lucide-react";

export type TestimonialItem = { id?: string; name: string; rating: number; comment: string };

// Placeholder reviews — shown until real, approved testimonials exist in the database.
const fallback: TestimonialItem[] = [
  { name: "A. Sharma", rating: 5, comment: "Best mix I've gotten for the price. The engineer actually listens." },
  { name: "R. Gurung", rating: 5, comment: "Booked a rehearsal slot in two minutes flat. Room sounds great." },
  { name: "N. Thapa", rating: 4, comment: "Mastering brought my track up to streaming loudness without losing warmth." }
];

export default function Testimonials({ reviews = fallback }: { reviews?: TestimonialItem[] }) {
  return (
    <section className="py-28 px-6 bg-ink">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">Word of mouth</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-14">TESTIMONIALS</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.id || r.name} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-char2 p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s < r.rating ? "fill-amber text-amber" : "text-white/15"}
                    />
                  ))}
                </div>
                <p className="text-mist mb-5 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                <p className="text-sm font-semibold text-paper">{r.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
