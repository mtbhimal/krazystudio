import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUploadedFile } from "@/lib/uploads";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const image = await prisma.galleryImage.findUnique({ where: { id: params.id } });
  if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  await prisma.galleryImage.delete({ where: { id: params.id } });
  await deleteUploadedFile(image.imageUrl); // clean up the file on disk too, not just the DB row

  return NextResponse.json({ success: true });
}
