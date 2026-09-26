"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string | null;
  imageUrl: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/gallery");
    setImages(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");

    // We use FormData (not JSON.stringify) because we're sending a real binary file.
    const form = new FormData();
    form.append("file", file);
    form.append("title", title);

    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setTitle("");
      setFile(null);
      (document.getElementById("gallery-file-input") as HTMLInputElement).value = "";
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? This can't be undone.")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-4xl tracking-wide text-paper mb-6">GALLERY</h1>

      <form onSubmit={handleUpload} className="mb-8 rounded-2xl border border-white/10 bg-char2 p-6 space-y-4 max-w-md">
        <h2 className="font-semibold text-paper">Upload New Image</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg bg-char border border-white/10 px-4 py-2.5 text-paper focus:border-violet focus:outline-none"
        />
        <input
          id="gallery-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-violet file:px-4 file:py-2 file:text-paper file:cursor-pointer"
        />
        <button
          type="submit"
          disabled={!file || uploading}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-square bg-char2">
              <Image src={img.imageUrl} alt={img.title || "Gallery image"} fill className="object-cover" unoptimized />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 rounded-full bg-red-500/80 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {images.length === 0 && <p className="text-mist col-span-full">No images uploaded yet.</p>}
        </div>
      )}
    </div>
  );
}
