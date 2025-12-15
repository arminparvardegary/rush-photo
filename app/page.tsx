import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import PackageSelection from "@/components/PackageSelection";
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
      <Portfolio />
      <Process />
      <PackageSelection />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
