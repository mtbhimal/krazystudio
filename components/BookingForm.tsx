"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { ServiceItem } from "./Services";

type Status = "idle" | "loading" | "success" | "error";

export default function BookingForm({
  services,
  preselectedServiceId
}: {
  services: ServiceItem[];
  preselectedServiceId?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [statusUrl, setStatusUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      serviceId: form.get("serviceId"),
      appointmentDate: form.get("appointmentDate"),
      appointmentTime: form.get("appointmentTime"),
      message: form.get("message")
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          const flat: Record<string, string> = {};
          Object.entries(data.issues as Record<string, string[]>).forEach(([k, v]) => {
            flat[k] = v[0];
          });
          setErrors(flat);
        }
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setStatusUrl(data.statusUrl || null);
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrorMessage("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-violet/40 bg-char2 p-10 text-center"
      >
        <CheckCircle2 className="mx-auto mb-4 text-violet" size={40} />
        <h3 className="font-display text-2xl tracking-wide mb-2">Request Sent</h3>
        <p className="text-mist">
          We&apos;ve emailed you a confirmation. Our team will reach out shortly to confirm your
          appointment.
        </p>
        {statusUrl && (
          <a
            href={statusUrl}
            className="mt-5 inline-block rounded-full border border-violet/50 px-5 py-2.5 text-sm font-semibold text-violet hover:bg-violet/10"
          >
            Track your booking &amp; message us
          </a>
        )}
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 block mx-auto text-sm font-semibold text-violet hover:text-magenta"
        >
          Book another session
        </button>
      </motion.div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <AlertCircle size={16} /> {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Field label="Full Name" name="name" required error={errors.name} />
      <Field label="Email" name="email" type="email" required error={errors.email} />
      <Field label="Phone Number" name="phone" type="tel" required error={errors.phone} />

      <div>
        <label className="block text-sm text-mist mb-1.5" htmlFor="serviceId">
          Service *
        </label>
        <select
          id="serviceId"
          name="serviceId"
          required
          defaultValue={preselectedServiceId || ""}
          className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.serviceId && <p className="mt-1 text-xs text-red-400">{errors.serviceId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" name="appointmentDate" type="date" required min={today} error={errors.appointmentDate} />
        <Field label="Time" name="appointmentTime" type="time" required error={errors.appointmentTime} />
      </div>

      <div>
        <label className="block text-sm text-mist mb-1.5" htmlFor="message">
          Message / Requirements
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
          placeholder="Tell us about the session..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-violet px-6 py-4 font-semibold text-paper hover:bg-magenta transition-colors disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="animate-spin" size={18} />}
        {status === "loading" ? "Submitting..." : "Request Appointment"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  error
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-mist mb-1.5" htmlFor={name}>
        {label} {required && "*"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        className="w-full rounded-lg bg-char2 border border-white/10 px-4 py-3 text-paper focus:border-violet focus:outline-none"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
