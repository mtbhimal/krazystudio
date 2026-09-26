import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// Everything gets saved under /public/uploads/<folder>/ so Next.js can serve it
// as a normal static file at /uploads/<folder>/<filename> — no extra API route needed.
//
// IMPORTANT (read this before you deploy): this writes to local disk. That's perfect
// for running the project on your own machine. It will NOT work reliably on Vercel,
// Netlify, or most serverless hosts, because their filesystem is wiped on every
// deploy (and isn't shared between server instances). Before you go live, swap this
// function's body for an upload to Vercel Blob, Cloudinary, or S3 — everything that
// CALLS this function (the CMS routes) stays exactly the same, you'd only rewrite
// what's inside saveUploadedFile.

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-m4a", "audio/mp4"];
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB

export type UploadKind = "image" | "audio";

export async function saveUploadedFile(
  file: File,
  folder: "images" | "audio",
  kind: UploadKind
): Promise<{ url: string; filename: string }> {
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type "${file.type}". Allowed: ${allowed.join(", ")}`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 15MB.`);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || (kind === "image" ? ".jpg" : ".mp3");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/uploads/${folder}/${filename}`, filename };
}

// Deletes a previously uploaded file given its public URL (e.g. "/uploads/images/abc.jpg").
// Safe to call even if the file was already removed — it just logs and moves on.
export async function deleteUploadedFile(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith("/uploads/")) return; // don't try to delete external/placeholder URLs
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch (err) {
    console.warn(`Could not delete uploaded file at ${filePath}:`, err);
  }
}
