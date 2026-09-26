"use client";

import { motion } from "framer-motion";

/**
 * The site's signature element: a live-looking audio waveform.
 * Reused in the hero, section dividers, and the audio player —
 * the visual thread that ties "recording studio" to every screen.
 */
export default function Waveform({
  bars = 40,
  className = "",
  color = "violet"
}: {
  bars?: number;
  className?: string;
  color?: "violet" | "amber" | "magenta";
}) {
  const colorMap = {
    violet: "bg-violet",
    amber: "bg-amber",
    magenta: "bg-magenta"
  };

  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const height = 20 + Math.sin(i * 0.9) * 15 + Math.random() * 15;
        return (
          <motion.span
            key={i}
            className={`w-[3px] rounded-full ${colorMap[color]}`}
            style={{ height: `${height}%`, opacity: 0.4 + (i % 5) * 0.12 }}
            animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
            transition={{
              duration: 1.4 + (i % 5) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.03
            }}
          />
        );
      })}
    </div>
  );
}
