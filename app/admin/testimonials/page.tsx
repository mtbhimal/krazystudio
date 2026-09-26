"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Star, Plus } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
}

const emptyForm = { name: "", rating: 5, comment: "" };

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/testimonials");
    setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, approved: true }) // testimonials the admin types in are pre-approved
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save testimonial");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function toggleApproved(review: Review) {
    await fetch(`/api/admin/testimonials/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !review.approved })
    });
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, approved: !r.approved } : r)));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial? This can't be undone.")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-paper mb-6">TESTIMONIALS</h1>

      <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-white/10 bg-char2 p-6 space-y-4 max-w-md">
        <h2 className="font-semibold text-paper">Add Testimonial</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          type="text"
          placeholder="Client name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <div>
          <label className="block text-xs text-mist mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                aria-label={`${n} stars`}
              >
                <Star size={22} className={n <= form.rating ? "fill-amber text-amber" : "text-white/20"} />
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="Review text"
          rows={3}
          value={form.comment}
          onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
          required
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving || !form.name || !form.comment}
          className="flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-paper hover:bg-magenta transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {saving ? "Saving..." : "Add Testimonial"}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-mist">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-char2 p-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-paper">{r.name}</p>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? "fill-amber text-amber" : "text-white/15"} />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-mist">{r.comment}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => toggleApproved(r)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    r.approved ? "bg-green-500/20 text-green-400" : "bg-white/10 text-mist"
                  }`}
                >
                  {r.approved ? "Approved" : "Hidden"}
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded-full bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500/30"
                  aria-label="Delete testimonial"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-mist">No testimonials yet.</p>}
        </div>
      )}
    </div>
  );
}
