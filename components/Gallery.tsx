"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Reveal from "./Reveal";

export type GalleryItem = {
  id: string;
  label: string;
  imageUrl?: string | null;
};

// Placeholder shots — used until real photos are uploaded from /admin/gallery.
const fallback: GalleryItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  label: `Studio shot ${i + 1}`,
  imageUrl: null
}));

export default function Gallery({ images = fallback }: { images?: GalleryItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const activeImage = images.find((img) => img.id === active);

  return (
    <section id="gallery" className="py-28 px-6 bg-char">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">Inside the room</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-14">GALLERY</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <Reveal key={img.id} delay={i * 0.05}>
              <button
                onClick={() => setActive(img.id)}
                className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl bg-char2 border border-white/10"
              >
                {img.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local uploads, no need for next/image optimization
                  <img
                    src={img.imageUrl}
                    alt={img.label}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl text-mist group-hover:scale-110 transition-transform duration-500">
                    🎚️
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-paper">{img.label}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-6 right-6 text-paper"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="w-full max-w-2xl aspect-[4/3] rounded-2xl bg-char2 flex items-center justify-center text-6xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {activeImage.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeImage.imageUrl} alt={activeImage.label} className="h-full w-full object-contain" />
              ) : (
                "🎚️"
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
