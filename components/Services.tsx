"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mic2,
  Sliders,
  Disc3,
  Music4,
  Podcast,
  Guitar
} from "lucide-react";
import Reveal from "./Reveal";
import { fallbackServices } from "@/lib/fallback-data";

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  duration: number;
  icon?: string | null;
};

const iconMap = {
  mic: Mic2,
  sliders: Sliders,
  disc: Disc3,
  music: Music4,
  podcast: Podcast,
  guitar: Guitar
};

export default function Services({
  services = fallbackServices
}: {
  services?: ServiceItem[];
}) {
  return (
    <section id="services" className="relative py-28 px-6 bg-char">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">
            What we do
          </p>

          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-14">
            OUR SERVICES
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const iconName =
              typeof s.icon === "string" ? s.icon : "music";

            const Icon =
              iconMap[iconName as keyof typeof iconMap] ?? Music4;

            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative h-full rounded-2xl border border-white/10 bg-char2 p-7 transition-colors hover:border-violet/50"
                >
                  <Icon
                    className="text-violet mb-5"
                    size={28}
                  />

                  <h3 className="font-display text-2xl tracking-wide mb-2">
                    {s.name}
                  </h3>

                  <p className="text-sm text-mist mb-6">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mist">
                      {s.duration} min
                    </span>

                    <span className="font-semibold text-paper">
                      {s.price !== null && s.price !== undefined
                        ? `Rs. ${s.price.toLocaleString()}`
                        : "Contact us"}
                    </span>
                  </div>

                  <Link
                    href={`/booking?service=${encodeURIComponent(s.id)}`}
                    className="mt-6 inline-block text-sm font-semibold text-violet group-hover:text-magenta transition-colors"
                  >
                    Book this session →
                  </Link>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
