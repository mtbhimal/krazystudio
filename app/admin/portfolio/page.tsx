"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string | null;
  audioUrl: string;
  coverImageUrl: string;
}

export default function AdminPortfolioPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", artist: "", genre: "" });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  async function load() {
    const res = await fetch("/api/admin/portfolio");
    setTracks(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!audioFile) return;
    setUploading(true);
    setError("");

    const data = new FormData();
    data.append("title", form.title);
    data.append("artist", form.artist);
    data.append("genre", form.genre);
    data.append("audioFile", audioFile);
    if (coverImage) data.append("coverImage", coverImage);

    try {
      const res = await fetch("/api/admin/portfolio", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");
      setForm({ title: "", artist: "", genre: "" });
      setAudioFile(null);
      setCoverImage(null);
      (document.getElementById("audio-file-input") as HTMLInputElement).value = "";
      (document.getElementById("cover-file-input") as HTMLInputElement).value = "";
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this track? This can't be undone.")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-paper mb-6">PORTFOLIO / AUDIO</h1>

      <form onSubmit={handleUpload} className="mb-8 rounded-2xl border border-white/10 bg-char2 p-6 space-y-4 max-w-md">
        <h2 className="font-semibold text-paper">Upload New Track</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <input
          type="text"
          placeholder="Artist"
          value={form.artist}
          onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
          required
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <input
          type="text"
          placeholder="Genre (optional)"
          value={form.genre}
          onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <div>
          <label className="block text-xs text-mist mb-1">Audio file (mp3/wav/ogg) *</label>
          <input
            id="audio-file-input"
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/x-m4a,audio/mp4"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            required
            className="w-full text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-violet file:px-4 file:py-2 file:text-paper file:cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs text-mist mb-1">Cover image (optional)</label>
          <input
            id="cover-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            className="w-full text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-violet file:px-4 file:py-2 file:text-paper file:cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={!audioFile || !form.title || !form.artist || uploading}
          className="flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-paper hover:bg-magenta transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-mist">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {tracks.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-char2 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-paper">{t.title}</p>
                  <p className="text-sm text-mist">{t.artist}{t.genre ? ` · ${t.genre}` : ""}</p>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-full bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30"
                  aria-label="Delete track"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {/* Reuses the same public-facing AudioPlayer component — same look on the live site. */}
              <AudioPlayer src={t.audioUrl} />
            </div>
          ))}
          {tracks.length === 0 && <p className="text-mist">No tracks uploaded yet.</p>}
        </div>
      )}
    </div>
  );
}
