import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Camera, Sparkles, Package, Clock, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SERVICES = [
  {
    title: "E-commerce Photography",
    description: "Clean, professional product shots optimized for online stores. White background, multiple angles, and detail shots that convert browsers into buyers.",
    icon: Camera,
    features: [
      "White background shots",
      "Multiple angles (front, back, side, top)",
      "Detail and texture close-ups",
      "Lifestyle context shots",
      "Image optimization for web"
    ],
    image: "/images/portfolio/sneaker.jpg",
    price: "Starting at $49/product"
  },
  {
    title: "Lifestyle Photography",
    description: "Show your products in real-world settings. Create emotional connections and help customers visualize your products in their lives.",
    icon: Sparkles,
    features: [
      "Styled scenes and props",
      "Natural lighting setups",
      "Lifestyle models (optional)",
      "Multiple scene variations",
      "Social media ready formats"
    ],
    image: "/images/portfolio/flowers-table.jpg",
    price: "Starting at $99/product"
  },
  {
    title: "360° Product Views",
    description: "Interactive 360-degree spins that let customers examine every detail. Perfect for high-value products and reducing returns.",
    icon: Package,
    features: [
      "36-72 frames per rotation",
      "Interactive web viewer",
      "Smooth, professional rotation",
      "Works on all devices",
      "Quick turnaround"
    ],
    image: "/images/portfolio/speakers.jpg",
    price: "Starting at $149/product"
  },
  {
    title: "Rush Service",
    description: "Need photos urgently? Our rush service delivers studio-quality results in 24 hours without compromising on quality.",
    icon: Clock,
    features: [
      "24-hour turnaround",
      "Priority queue processing",
      "Same quality standards",
      "Real-time status updates",
      "Overnight shipping available"
    ],
    image: "/images/portfolio/pink-bottle.jpg",
    price: "+50% surcharge"
  }
];

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold tracking-wider uppercase mb-6">
              <Camera className="w-4 h-4" />
              <span>Our Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Professional Photography
              <br />
              <span className="text-[#E63946]">For Every Need</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              From clean e-commerce shots to immersive 360° views, we offer comprehensive
              product photography services tailored to your business goals.
            </p>

            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63946] text-white text-lg font-semibold rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-32">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}
                >
                  {/* Image */}
                  <div className={`relative ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                      <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="w-16 h-16 rounded-2xl bg-[#E63946]/10 text-[#E63946] flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h2>

                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/order"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
                    >
                      Book This Service
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Not sure which service is right for you?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Our team is here to help you choose the perfect photography solution for your products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E63946] text-white text-lg font-semibold rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
            >
              Talk to an Expert
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
