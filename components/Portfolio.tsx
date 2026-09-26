"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import AudioPlayer from "./AudioPlayer";

export type PortfolioItem = {
  id: string;
  title: string;
  artist: string;
  genre?: string | null;
  audioUrl: string;
  coverImageUrl: string;
};

// Placeholder tracks — replace with real Prisma-backed data in Stage 3.
const fallback: PortfolioItem[] = [
  { id: "1", title: "Midnight Drive", artist: "Sonder", genre: "Indie", audioUrl: "/audio/placeholder.mp3", coverImageUrl: "/images/placeholder-cover-1.jpg" },
  { id: "2", title: "Concrete Bloom", artist: "Nova Vale", genre: "Hip-Hop", audioUrl: "/audio/placeholder.mp3", coverImageUrl: "/images/placeholder-cover-2.jpg" },
  { id: "3", title: "Static Bloom", artist: "The Aftertones", genre: "Rock", audioUrl: "/audio/placeholder.mp3", coverImageUrl: "/images/placeholder-cover-3.jpg" }
];

export default function Portfolio({ items = fallback }: { items?: PortfolioItem[] }) {
  return (
    <section id="portfolio" className="py-28 px-6 bg-ink">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">Our work</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-14">FROM THE BOOTH</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((track, i) => (
            <Reveal key={track.id} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-char2">
                <div className="relative aspect-square bg-char">
                  {/* Swap for real cover art once uploaded to Cloudinary/S3 */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">🎵</div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl tracking-wide">{track.title}</h3>
                  <p className="text-sm text-mist mb-4">
                    {track.artist} {track.genre ? `· ${track.genre}` : ""}
                  </p>
                  <AudioPlayer src={track.audioUrl} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
