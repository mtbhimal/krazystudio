import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}

// Lets the admin add a testimonial directly (e.g. one a happy client sent by text/email)
// as an alternative to building a public-facing "leave a review" form.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";
  const rating = Number(body?.rating);
  const approved = Boolean(body?.approved);

  if (!name || !comment) {
    return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be a whole number from 1 to 5" }, { status: 400 });
  }

  const review = await prisma.review.create({ data: { name, comment, rating, approved } });
  return NextResponse.json(review, { status: 201 });
}
