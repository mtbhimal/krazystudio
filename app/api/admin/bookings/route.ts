import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendClientStatusUpdate } from "@/lib/email";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      service: true,
      messages: { orderBy: { createdAt: "asc" } }
    }
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json(booking);
}

// This is the "One-Click Confirmation" endpoint: the admin dashboard's
// Confirm / Cancel / Complete buttons all call this same route with a
// different "status" value.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status must be one of ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: { status },
    include: { service: true }
  });

  // Log the change in the shared message thread so both sides see a timeline, not just an email.
  await prisma.message.create({
    data: {
      bookingId: booking.id,
      sender: "SYSTEM",
      body: `Booking status changed to ${status}.`
    }
  });

  // Email the client only for the statuses that matter to them (skip PENDING — that's the starting state).
  let emailResult: { sent: boolean } = { sent: false };
  if (status === "CONFIRMED" || status === "CANCELLED" || status === "COMPLETED") {
    emailResult = await sendClientStatusUpdate({
      clientEmail: booking.email,
      clientName: booking.name,
      serviceName: booking.service.name,
      appointmentDate: new Date(booking.appointmentDate).toLocaleDateString(),
      appointmentTime: booking.appointmentTime,
      status,
      statusPageUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/booking/status/${booking.id}?token=${booking.accessToken}`
    });
  }

  return NextResponse.json({ success: true, booking, emailDelivered: emailResult.sent });
}
