"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageCircle } from "lucide-react";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: Status;
  service: { name: string };
  _count: { messages: number };
}

const STATUS_STYLES: Record<Status, string> = {
  PENDING: "bg-amber/20 text-amber",
  CONFIRMED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
  COMPLETED: "bg-violet/20 text-violet"
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // This one function IS the "one-click confirm" feature — it's reused for Cancel and Complete too.
  async function updateStatus(id: string, status: Status) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      await load(); // refresh the table so the new status shows immediately
    } catch {
      alert("Couldn't update that booking. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-paper mb-6">BOOKINGS</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-mist">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-char2 text-mist text-left">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Messages</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <p className="text-paper">{b.name}</p>
                    <p className="text-mist text-xs">{b.email} · {b.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-paper">{b.service.name}</td>
                  <td className="px-4 py-3 text-paper">
                    {new Date(b.appointmentDate).toLocaleDateString()} · {b.appointmentTime}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_STYLES[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="flex items-center gap-1 text-violet hover:text-magenta">
                      <MessageCircle size={14} /> {b._count.messages}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {b.status !== "CONFIRMED" && (
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== "CANCELLED" && (
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                          className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === "CONFIRMED" && (
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => updateStatus(b.id, "COMPLETED")}
                          className="rounded-full bg-violet/20 px-3 py-1 text-xs font-semibold text-violet hover:bg-violet/30 disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-mist">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
