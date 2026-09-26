import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(images);
}

// Uses multipart/form-data (not JSON) because we're uploading a real file, not text.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const title = form.get("title");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image file was uploaded" }, { status: 400 });
  }

  try {
    const { url } = await saveUploadedFile(file, "images", "image");
    const image = await prisma.galleryImage.create({
      data: { imageUrl: url, title: typeof title === "string" && title.trim() ? title.trim() : null }
    });
    return NextResponse.json(image, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 });
  }
}
