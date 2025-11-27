import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PhotoStyles from "@/components/PhotoStyles";
import BeforeAfter from "@/components/BeforeAfter";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <Marquee />
      <PhotoStyles />
      <BeforeAfter />
      <Process />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
