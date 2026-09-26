import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-2xl tracking-wide">KRAZY MUSIC STUDIO</p>
          <p className="text-sm text-mist mt-1">[STUDIO ADDRESS] · [STUDIO PHONE]</p>
        </div>
        <div className="flex gap-6 text-sm text-mist">
          <Link href="/privacy" className="hover:text-paper">Privacy</Link>
          <Link href="/terms" className="hover:text-paper">Terms</Link>
          <a href="mailto:owner@example.com" className="hover:text-paper">[STUDIO EMAIL]</a>
        </div>
      </div>
      <p className="text-center text-xs text-white/20 mt-10">
        © {new Date().getFullYear()} Krazy Music Studio. All rights reserved.
      </p>
    </footer>
  );
}
