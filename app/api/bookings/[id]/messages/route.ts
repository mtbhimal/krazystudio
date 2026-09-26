import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOwnerNewMessageEmail } from "@/lib/email";

// This route has NO login check — a client never creates an account. Instead,
// every request must include the booking's private "token" (the accessToken
// from the database), which only the person who made the booking has, because
// it's only ever shown to them once, in the confirmation screen/email link.
// If the token doesn't match, we treat it exactly like "booking not found" —
// we never reveal whether the booking ID itself is valid.
async function getBookingIfTokenMatches(bookingId: string, token: string | null) {
  if (!token) return null;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.accessToken !== token) return null;
  return booking;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.nextUrl.searchParams.get("token");
  const booking = await getBookingIfTokenMatches(params.id, token);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { bookingId: params.id },
    orderBy: { createdAt: "asc" }
  });
  await prisma.message.updateMany({
    where: { bookingId: params.id, sender: "ADMIN", readByClient: false },
    data: { readByClient: true }
  });

  return NextResponse.json({ booking, messages });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : null;
  const text = typeof body?.body === "string" ? body.body.trim() : "";

  const booking = await getBookingIfTokenMatches(params.id, token);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (!text) return NextResponse.json({ error: "Message body is required" }, { status: 400 });

  const message = await prisma.message.create({
    data: { bookingId: params.id, sender: "CLIENT", body: text, readByClient: true, readByAdmin: false }
  });

  const emailResult = await sendOwnerNewMessageEmail({
    clientName: booking.name,
    bookingId: booking.id,
    messagePreview: text.slice(0, 200)
  });

  return NextResponse.json({ success: true, message, emailDelivered: emailResult.sent }, { status: 201 });
}
