"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-28 px-6 bg-char">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">Get in touch</p>
          <h2 className="font-display text-5xl md:text-6xl tracking-wide mb-10">CONTACT</h2>
        </Reveal>

        {status === "success" ? (
          <div className="rounded-2xl border border-violet/40 bg-char2 p-10 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-violet" size={32} />
            <p className="text-paper font-semibold">Message sent</p>
            <p className="text-mist text-sm mt-1">We&apos;ll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              required
              placeholder="Name"
              className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Message"
              className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 rounded-full bg-violet px-6 py-3.5 font-semibold text-paper hover:bg-magenta transition-colors disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="animate-spin" size={16} />}
              Send Message
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400">Couldn&apos;t send your message — try again.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
