import Header from "@/components/Header";
import Hero from "@/components/Hero";
// import SocialProof from "@/components/SocialProof";
// import Portfolio from "@/components/Portfolio";
// import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
// import Process from "@/components/Process";
// import VideoTestimonial from "@/components/VideoTestimonial";
import PackageSelection from "@/components/PackageSelection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import GlobalEffects from "@/components/GlobalEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-rush-light">
      <GlobalEffects />
      <Header />
      <Hero />
      {/* 
        Temporarily hidden to clean up layout and focus on the 3 Plans.
        Will be redesigned/re-enabled in future phases.
        <SocialProof />
        <Portfolio />
        <BeforeAfterShowcase />
        <Process />
        <VideoTestimonial />
      */}
      <PackageSelection />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
