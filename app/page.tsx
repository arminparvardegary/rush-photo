import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Marquee from "@/components/Marquee";
import PhotoStyles from "@/components/PhotoStyles";
import BeforeAfter from "@/components/BeforeAfter";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import QuickContact from "@/components/QuickContact";
import GlobalEffects from "@/components/GlobalEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <GlobalEffects />
      <Header />
      <TrustBadges />
      <Marquee />
      <PhotoStyles />
      <BeforeAfter />
      <div id="portfolio">
        <Portfolio />
      </div>
      <Process />
      <Testimonials />
      <Pricing />
      <div id="faq">
        <FAQ />
      </div>
      <CTA />
      <Footer />
      <FloatingCTA />
      <QuickContact />
    </main>
  );
}
