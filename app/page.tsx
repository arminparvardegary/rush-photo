import Header from "@/components/Header";
import PackageSelection from "@/components/PackageSelection";
import Footer from "@/components/Footer";
import GlobalEffects from "@/components/GlobalEffects";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <GlobalEffects />
      <Header />
      <PackageSelection />
      <Footer />
    </main>
  );
}
