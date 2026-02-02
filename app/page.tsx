import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import PackageSelection from "@/components/PackageSelection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import GlobalEffects from "@/components/GlobalEffects";

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
