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

// Server component: runs on the server at request time, so it can read straight
// from the database and hand the results down as props. This is what makes the
// CMS "live" — whatever the owner uploads/edits in /admin shows up here.
export default async function HomePage() {
  const [portfolioTracks, galleryImages, approvedReviews] = await Promise.all([
    prisma.portfolio.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 9 }),
    prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 9 })
  ]);

  return (
    <>
      <div className="grain" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        {/* Each component keeps its own hard-coded fallback content, so the homepage
            still looks complete on a brand-new install before you've uploaded anything. */}
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
