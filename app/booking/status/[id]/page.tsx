"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, Send, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type MessageSender = "ADMIN" | "CLIENT" | "SYSTEM";
interface Message {
  id: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
}
interface Booking {
  id: string;
  name: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  appointmentDate: string;
  appointmentTime: string;
}

const STATUS_STYLES: Record<Booking["status"], string> = {
  PENDING: "bg-amber/20 text-amber border-amber/40",
  CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/40",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/40",
  COMPLETED: "bg-violet/20 text-violet border-violet/40"
};

export default function BookingStatusPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    if (!token) {
      setError("This link is missing its access token. Use the exact link from your confirmation email.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${params.id}/messages?token=${encodeURIComponent(token)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBooking(data.booking);
      setMessages(data.messages);
    } catch {
      setError("We couldn't find that booking. Double-check the link from your email.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !token) return;
    setSending(true);
    try {
      const res = await fetch(`/api/bookings/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, body: reply.trim() })
      });
      if (!res.ok) throw new Error();
      setReply("");
      await load(); // refresh the thread so the new message appears
    } catch {
      setError("Couldn't send that message — please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink px-6 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl tracking-wide mb-6">YOUR BOOKING</h1>

          {loading && (
            <div className="flex items-center gap-2 text-mist">
              <Loader2 className="animate-spin" size={18} /> Loading...
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {!loading && booking && (
            <>
              <div className="rounded-2xl border border-white/10 bg-char2 p-6 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-mist">Hi {booking.name}, here's the latest:</p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-paper">
                  {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                </p>
              </div>

              <h2 className="font-display text-2xl tracking-wide mb-4">MESSAGES</h2>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {messages.length === 0 && <p className="text-mist text-sm">No messages yet.</p>}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl px-4 py-3 text-sm max-w-[85%] ${
                      m.sender === "CLIENT"
                        ? "ml-auto bg-violet/20 text-paper"
                        : m.sender === "SYSTEM"
                          ? "mx-auto bg-white/5 text-mist text-xs text-center italic"
                          : "bg-char2 border border-white/10 text-paper"
                    }`}
                  >
                    {m.body}
                    <div className="mt-1 text-[10px] text-mist/70">
                      {m.sender === "CLIENT" ? "You" : m.sender === "ADMIN" ? "Studio" : "System"} ·{" "}
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Send a message to the studio..."
                  className="flex-1 rounded-full bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="flex items-center justify-center rounded-full bg-violet px-5 text-paper hover:bg-magenta transition-colors disabled:opacity-60"
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
