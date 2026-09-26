"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-orange-500/30 bg-black/90 px-5 py-4 shadow-lg backdrop-blur-xl">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-wider text-white"
        >
          KRAZY<span className="text-orange-500">.</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-orange-500/10 hover:text-orange-400"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/booking"
            className="ml-3 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-black hover:bg-orange-400"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-white hover:text-orange-500 md:hidden"
        >
          <Menu size={26} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black">
          <div className="flex justify-end p-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-white hover:text-orange-500"
            >
              <X size={30} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-7 pt-20">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-white hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-orange-500 px-8 py-3 font-bold text-black"
            >
              Book a Session
            </Link>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-500">
              KRAZY MUSIC STUDIO
            </p>

            <p className="mt-2 text-xs text-white/30">
              Recording • Mixing • Mastering
            </p>
          </div>
        </div>
      )}
    </header>
  );
}