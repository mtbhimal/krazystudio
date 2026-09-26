const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const services = [
  { name: "Recording", slug: "recording", description: "Full-band or solo tracking with a live engineer.", price: 800000, duration: 60, icon: "mic" },
  { name: "Mixing", slug: "mixing", description: "Balance, depth and clarity for your rough tracks.", price: 600000, duration: 90, icon: "sliders" },
  { name: "Mastering", slug: "mastering", description: "Radio-ready loudness and polish, streaming-optimized.", price: 350000, duration: 30, icon: "disc" },
  { name: "Music Production", slug: "production", description: "Beat-making and full arrangement from scratch.", price: null, duration: 120, icon: "music" },
  { name: "Podcast Recording", slug: "podcast", description: "Multi-mic podcast capture with post-production.", price: 500000, duration: 90, icon: "podcast" },
  { name: "Rehearsal", slug: "rehearsal", description: "Full backline rehearsal space, by the hour.", price: 200000, duration: 60, icon: "guitar" }
];

async function main() {
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s
    });
  }
  console.log(`Seeded ${services.length} services.`);

  // Create (or update) the one admin account used to log into /admin.
  // Reads from ADMIN_EMAIL / ADMIN_PASSWORD in your .env file — set those before seeding.
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin user creation. " +
        "Add them and re-run `npx prisma db seed` to create your admin login."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: passwordHash, role: "ADMIN" },
    create: {
      name: "Studio Admin",
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN"
    }
  });
  console.log(`Admin user ready: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
