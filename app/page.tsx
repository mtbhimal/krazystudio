export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let portfolioTracks: any[] = [];
  let galleryImages: any[] = [];
  let approvedReviews: any[] = [];

  try {
    const [portfolio, gallery, reviews] = await Promise.all([
      prisma.portfolio.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 9 }),
      prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 9 })
    ]);
    portfolioTracks = portfolio;
    galleryImages = gallery;
    approvedReviews = reviews;
  } catch (error) {
    console.error("Failed to fetch homepage data from database:", error);
  }

  return (
    <>
      <div className="grain" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio items={portfolioTracks.length > 0 ? portfolioTracks : undefined} />
        <Gallery
          images={
            galleryImages.length > 0
              ? galleryImages.map((img) => ({ id: img.id, label: img.title || "Studio photo", imageUrl: img.imageUrl }))
              : undefined
          }
        />
        <Testimonials reviews={approvedReviews.length > 0 ? approvedReviews : undefined} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}