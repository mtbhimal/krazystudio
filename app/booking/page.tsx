export const dynamic = 'force-dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import Waveform from "@/components/Waveform";
import { prisma } from "@/lib/prisma";

export default async function BookingPage({
  searchParams
}: {
  searchParams: { service?: string };
}) {
  // Load services directly from the database.
  // This ensures the form uses the real Prisma IDs.
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-ink px-6 pt-32 pb-20">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-3">
            Reserve your slot
          </p>

          <h1 className="font-display text-5xl tracking-wide mb-4">
            BOOK A SESSION
          </h1>

          <p className="text-mist mb-10">
            Tell us what you need — we&apos;ll confirm by email and phone.
          </p>

          <Waveform
            bars={24}
            className="h-8 mb-10"
            color="magenta"
          />

          <BookingForm
            services={services}
            preselectedServiceId={searchParams.service}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
