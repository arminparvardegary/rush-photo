import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Portfolio from "@/components/Portfolio";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
import Process from "@/components/Process";
import VideoTestimonial from "@/components/VideoTestimonial";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import GlobalEffects from "@/components/GlobalEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink">
      <GlobalEffects />
      <Header />
      <Hero />
      <SocialProof />
      <Portfolio />
      <BeforeAfterShowcase />
      <Process />
      <VideoTestimonial />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
