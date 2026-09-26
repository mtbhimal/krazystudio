"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "ADMIN" | "CLIENT" | "SYSTEM";
  body: string;
  createdAt: string;
}
interface BookingDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  appointmentDate: string;
  appointmentTime: string;
  message: string | null;
  service: { name: string };
  messages: Message[];
}

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/bookings/${params.id}`);
    const bookingData = await res.json();
    // The booking route returns messages too, but we re-fetch the messages route
    // right after so any CLIENT messages get marked "read by admin".
    await fetch(`/api/admin/bookings/${params.id}/messages`);
    setBooking(bookingData);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply.trim() })
      });
      if (!res.ok) throw new Error();
      setReply("");
      await load();
    } catch {
      alert("Couldn't send that message.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-mist">
        <Loader2 className="animate-spin" size={18} /> Loading...
      </div>
    );
  }
  if (!booking) return <p className="text-mist">Booking not found.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl tracking-wide text-paper mb-2">{booking.name}</h1>
      <p className="text-mist mb-6">
        {booking.service.name} · {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime} ·{" "}
        {booking.email} · {booking.phone}
      </p>
      {booking.message && (
        <p className="mb-6 rounded-lg border border-white/10 bg-char2 p-4 text-sm text-paper">
          <span className="text-mist">Client note: </span>
          {booking.message}
        </p>
      )}

      <h2 className="font-display text-2xl tracking-wide text-paper mb-4">MESSAGE THREAD</h2>
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {booking.messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl px-4 py-3 text-sm max-w-[85%] ${
              m.sender === "ADMIN"
                ? "ml-auto bg-violet/20 text-paper"
                : m.sender === "SYSTEM"
                  ? "mx-auto bg-white/5 text-mist text-xs text-center italic"
                  : "bg-char2 border border-white/10 text-paper"
            }`}
          >
            {m.body}
            <div className="mt-1 text-[10px] text-mist/70">
              {m.sender === "ADMIN" ? "You" : m.sender === "CLIENT" ? booking.name : "System"} ·{" "}
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendReply} className="flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to this client..."
          className="flex-1 rounded-full bg-char border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !reply.trim()}
          className="flex items-center justify-center rounded-full bg-violet px-5 text-paper hover:bg-magenta transition-colors disabled:opacity-60"
        >
          {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
