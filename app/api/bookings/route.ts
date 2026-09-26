import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { sendOwnerBookingNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Selected service does not exist" }, { status: 400 });
  }

  const appointmentDate = new Date(data.appointmentDate);

  const clash = await prisma.booking.findFirst({
    where: {
      serviceId: data.serviceId,
      appointmentDate,
      appointmentTime: data.appointmentTime,
      status: { in: ["PENDING", "CONFIRMED"] }
    }
  });
  if (clash) {
    return NextResponse.json(
      { error: "That time slot was just taken. Please pick another." },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      serviceId: data.serviceId,
      appointmentDate,
      appointmentTime: data.appointmentTime,
      message: data.message || null
    }
    // Note: "accessToken" doesn't need to be passed here — the schema's
    // @default(cuid()) generates a unique one automatically.
  });

  // Seed the two-way message thread with a SYSTEM entry so the client's status
  // page (and the admin's booking detail page) both have something to show
  // immediately, even before anyone sends a manual message.
  await prisma.message.create({
    data: {
      bookingId: booking.id,
      sender: "SYSTEM",
      body: `Booking request received for ${service.name} on ${data.appointmentDate} at ${data.appointmentTime}. Awaiting confirmation.`
    }
  });

  // Only one email is sent per booking: to the studio owner, with a Call Customer button.
  const emailPayload = { ...data, serviceName: service.name, bookingId: booking.id };
  const ownerResult = await sendOwnerBookingNotification(emailPayload);

  if (!ownerResult.sent) {
    console.error("Owner notification email failed to send for booking", booking.id);
  }

  return NextResponse.json(
    {
      success: true,
      bookingId: booking.id,
      // The client uses this link to check status and message the studio without logging in.
      statusUrl: `/booking/status/${booking.id}?token=${booking.accessToken}`,
      emailDelivered: ownerResult.sent
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
