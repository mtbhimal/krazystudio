import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const saved = await prisma.contactMessage.create({ data });

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Krazy Music Studio <onboarding@resend.dev>",
        to: process.env.STUDIO_OWNER_EMAIL || "",
        subject: `New Contact Message — ${data.name}`,
        html: `<p><strong>${data.name}</strong> (${data.email}${data.phone ? `, ${data.phone}` : ""})</p><p>${data.message}</p>`
      });
    } catch (err) {
      console.error("Failed to send contact notification email:", err);
    }
  }

  return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
}
