import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendClientNewMessageEmail } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const messages = await prisma.message.findMany({
    where: { bookingId: params.id },
    orderBy: { createdAt: "asc" }
  });
  // Mark every client message as read now that the admin opened the thread.
  await prisma.message.updateMany({
    where: { bookingId: params.id, sender: "CLIENT", readByAdmin: false },
    data: { readByAdmin: true }
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const text = typeof body?.body === "string" ? body.body.trim() : "";
  if (!text) return NextResponse.json({ error: "Message body is required" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const message = await prisma.message.create({
    data: { bookingId: params.id, sender: "ADMIN", body: text, readByClient: false, readByAdmin: true }
  });

  const emailResult = await sendClientNewMessageEmail({
    clientEmail: booking.email,
    clientName: booking.name,
    messagePreview: text.slice(0, 200),
    statusPageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/booking/status/${booking.id}?token=${booking.accessToken}`
  });

  return NextResponse.json({ success: true, message, emailDelivered: emailResult.sent }, { status: 201 });
}
