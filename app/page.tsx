import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import GlobalEffects from "@/components/GlobalEffects";

// Lazy load below-the-fold components
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: true });
const PackageSelection = dynamic(() => import("@/components/PackageSelection"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });

export default function Home() {
  return (
    <main className="relative min-h-screen bg-rush-light">
      <GlobalEffects />
      <Header />
      <Hero />
      <Portfolio />
      <PackageSelection />
      <Testimonials />
      <Footer />
    </main>
  );
}
