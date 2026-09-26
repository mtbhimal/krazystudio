import { Resend } from "resend";
import type { BookingInput } from "./validation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const brand = {
  bg: "#0A0A0D",
  card: "#141319",
  accent: "#8B5CF6",
  text: "#F4F2F7",
  muted: "#B8B4C2"
};

function wrapper(title: string, bodyHtml: string) {
  return `
  <div style="background:${brand.bg};padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:${brand.card};border-radius:16px;overflow:hidden;border:1px solid #2A2733;">
      <div style="padding:24px 28px;border-bottom:1px solid #2A2733;">
        <p style="margin:0;color:${brand.accent};font-size:12px;letter-spacing:2px;text-transform:uppercase;">Krazy Music Studio</p>
        <h1 style="margin:6px 0 0;color:${brand.text};font-size:20px;">${title}</h1>
      </div>
      <div style="padding:24px 28px;color:${brand.muted};font-size:14px;line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #2A2733;color:#6B6878;font-size:12px;">
        Krazy Music Studio · [STUDIO ADDRESS] · [STUDIO PHONE]
      </div>
    </div>
  </div>`;
}

interface BookingEmailData extends BookingInput {
  serviceName: string;
  bookingId: string;
}

export async function sendOwnerBookingNotification(data: BookingEmailData) {
  if (!resend) {
    console.error("RESEND_API_KEY not set — skipping owner email. Booking was still saved.");
    return { sent: false };
  }

  const rawPhone = String(data.phone || "").trim();
  const cleanedPhone = rawPhone.replace(/[^0-9+]/g, "");

  const html = wrapper(
    "New Appointment Request",
    `
    <p style="color:${brand.text};font-weight:600;margin-top:0;">Customer</p>
    <p style="margin:4px 0;">Name: ${escapeHtml(data.name)}</p>
    <p style="margin:4px 0;">Email: ${escapeHtml(data.email)}</p>
    <p style="margin:4px 0;">Phone: ${escapeHtml(rawPhone)}</p>
    <p style="color:${brand.text};font-weight:600;margin-top:16px;">Appointment</p>
    <p style="margin:4px 0;">Service: ${escapeHtml(data.serviceName)}</p>
    <p style="margin:4px 0;">Date: ${escapeHtml(data.appointmentDate)}</p>
    <p style="margin:4px 0;">Time: ${escapeHtml(data.appointmentTime)}</p>
    ${data.message ? `<p style="color:${brand.text};font-weight:600;margin-top:16px;">Message</p><p style="margin:4px 0;">${escapeHtml(data.message)}</p>` : ""}
    <p style="margin-top:16px;color:#6B6878;">Submitted ${new Date().toLocaleString()}</p>

    <div style="margin-top:24px;">
      <a href="tel:${cleanedPhone}" style="display:inline-block;background:${brand.accent};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">
        📞 Call Customer (${escapeHtml(rawPhone)})
      </a>
    </div>
  `
  );

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Krazy Music Studio <onboarding@resend.dev>",
      to: process.env.STUDIO_OWNER_EMAIL || "",
      subject: `New Appointment Request — ${data.name}`,
      html
    });
    return { sent: true, result };
  } catch (err) {
    console.error("Failed to send owner notification email:", err);
    return { sent: false, error: err };
  }
}

interface StatusUpdateData {
  clientEmail: string;
  clientName: string;
  serviceName: string;
  appointmentDate: string; // formatted for display
  appointmentTime: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  statusPageUrl: string;
}

// Sent to the CLIENT when the admin clicks Confirm / Cancel / Complete on a booking.
export async function sendClientStatusUpdate(data: StatusUpdateData) {
  if (!resend) {
    console.error("RESEND_API_KEY not set — skipping client status email.");
    return { sent: false };
  }

  const statusCopy: Record<string, { title: string; message: string }> = {
    CONFIRMED: {
      title: "Your Appointment is Confirmed",
      message: "Good news — your session is confirmed. We'll see you then!"
    },
    CANCELLED: {
      title: "Your Appointment was Cancelled",
      message: "Your requested session has been cancelled. Reply on your booking page if this is unexpected."
    },
    COMPLETED: {
      title: "Thanks for Recording With Us",
      message: "Your session is marked complete. We'd love a testimonial if you have a moment!"
    }
  };
  const copy = statusCopy[data.status];

  const html = wrapper(
    copy.title,
    `
    <p style="margin-top:0;">${escapeHtml(copy.message)}</p>
    <p style="color:${brand.text};font-weight:600;margin-top:16px;">Appointment</p>
    <p style="margin:4px 0;">Service: ${escapeHtml(data.serviceName)}</p>
    <p style="margin:4px 0;">Date: ${escapeHtml(data.appointmentDate)}</p>
    <p style="margin:4px 0;">Time: ${escapeHtml(data.appointmentTime)}</p>
    <div style="margin-top:24px;">
      <a href="${data.statusPageUrl}" style="display:inline-block;background:${brand.accent};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">
        View booking &amp; messages
      </a>
    </div>
  `
  );

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Krazy Music Studio <onboarding@resend.dev>",
      to: data.clientEmail,
      subject: `${copy.title} — Krazy Music Studio`,
      html
    });
    return { sent: true, result };
  } catch (err) {
    console.error("Failed to send client status email:", err);
    return { sent: false, error: err };
  }
}

// Sent to the CLIENT when the admin posts a new message on their booking thread.
export async function sendClientNewMessageEmail(data: {
  clientEmail: string;
  clientName: string;
  messagePreview: string;
  statusPageUrl: string;
}) {
  if (!resend) {
    console.error("RESEND_API_KEY not set — skipping new-message email.");
    return { sent: false };
  }
  const html = wrapper(
    "New Message From the Studio",
    `
    <p style="margin-top:0;">Hi ${escapeHtml(data.clientName)}, you have a new message about your booking:</p>
    <p style="margin:12px 0;padding:12px;background:#0000002a;border-radius:8px;">${escapeHtml(data.messagePreview)}</p>
    <div style="margin-top:20px;">
      <a href="${data.statusPageUrl}" style="display:inline-block;background:${brand.accent};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">
        Reply
      </a>
    </div>
  `
  );
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Krazy Music Studio <onboarding@resend.dev>",
      to: data.clientEmail,
      subject: "New message about your booking — Krazy Music Studio",
      html
    });
    return { sent: true, result };
  } catch (err) {
    console.error("Failed to send client new-message email:", err);
    return { sent: false, error: err };
  }
}

// Sent to the STUDIO OWNER when a client replies on their booking thread.
export async function sendOwnerNewMessageEmail(data: {
  clientName: string;
  bookingId: string;
  messagePreview: string;
}) {
  if (!resend) {
    console.error("RESEND_API_KEY not set — skipping owner new-message email.");
    return { sent: false };
  }
  const html = wrapper(
    "New Client Reply",
    `
    <p style="margin-top:0;"><strong>${escapeHtml(data.clientName)}</strong> replied on booking ${escapeHtml(data.bookingId)}:</p>
    <p style="margin:12px 0;padding:12px;background:#0000002a;border-radius:8px;">${escapeHtml(data.messagePreview)}</p>
    <div style="margin-top:20px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/bookings/${data.bookingId}" style="display:inline-block;background:${brand.accent};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">
        Open in Admin
      </a>
    </div>
  `
  );
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Krazy Music Studio <onboarding@resend.dev>",
      to: process.env.STUDIO_OWNER_EMAIL || "",
      subject: `New reply from ${data.clientName} — Krazy Music Studio`,
      html
    });
    return { sent: true, result };
  } catch (err) {
    console.error("Failed to send owner new-message email:", err);
    return { sent: false, error: err };
  }
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toDateString() : String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
