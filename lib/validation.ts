import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-()\s]{7,20}$/, "Enter a valid phone number"),
  serviceId: z.string().min(1, "Select a service"),
  appointmentDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Select a valid date")
    .refine((val) => new Date(val).setHours(23, 59, 59, 0) >= Date.now(), {
      message: "Date can't be in the past"
    }),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Select a valid time"),
  message: z.string().trim().max(1000).optional().or(z.literal(""))
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short").max(2000)
});

export type ContactInput = z.infer<typeof contactSchema>;
