import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUploadedFile } from "@/lib/uploads";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const track = await prisma.portfolio.findUnique({ where: { id: params.id } });
  if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

  await prisma.portfolio.delete({ where: { id: params.id } });
  await deleteUploadedFile(track.audioUrl);
  await deleteUploadedFile(track.coverImageUrl);

  return NextResponse.json({ success: true });
}
