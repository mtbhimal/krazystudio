import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

export async function GET() {
  const tracks = await prisma.portfolio.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tracks);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = form.get("title");
  const artist = form.get("artist");
  const genre = form.get("genre");
  const description = form.get("description");
  const audioFile = form.get("audioFile");
  const coverImage = form.get("coverImage");

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof artist !== "string" || !artist.trim()) {
    return NextResponse.json({ error: "Artist is required" }, { status: 400 });
  }
  if (!(audioFile instanceof File) || audioFile.size === 0) {
    return NextResponse.json({ error: "An audio file is required" }, { status: 400 });
  }

  try {
    const { url: audioUrl } = await saveUploadedFile(audioFile, "audio", "audio");

    // Cover image is optional — fall back to a placeholder if the admin doesn't upload one.
    let coverImageUrl = "/images/placeholder-cover-1.jpg";
    if (coverImage instanceof File && coverImage.size > 0) {
      const saved = await saveUploadedFile(coverImage, "images", "image");
      coverImageUrl = saved.url;
    }

    const track = await prisma.portfolio.create({
      data: {
        title: title.trim(),
        artist: artist.trim(),
        genre: typeof genre === "string" && genre.trim() ? genre.trim() : null,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        audioUrl,
        coverImageUrl
      }
    });
    return NextResponse.json(track, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 });
  }
}
