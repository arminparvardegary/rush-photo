import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Zap, Star, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$49",
    unit: "per product",
    description: "Perfect for small businesses just getting started",
    icon: Zap,
    features: [
      "5 high-resolution images",
      "White background shots",
      "Basic retouching included",
      "3-5 day turnaround",
      "Web-optimized files",
      "Free return shipping"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$89",
    unit: "per product",
    description: "Most popular for growing e-commerce brands",
    icon: Star,
    features: [
      "10 high-resolution images",
      "White + lifestyle shots",
      "Advanced retouching",
      "2-3 day turnaround",
      "Multiple file formats",
      "Unlimited revisions",
      "Free return shipping",
      "Priority support"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "volume pricing",
    description: "For large catalogs and ongoing photography needs",
    icon: Crown,
    features: [
      "Unlimited images per product",
      "All photography styles",
      "Dedicated photographer",
      "Same-day turnaround available",
      "Custom shooting guidelines",
      "On-site photography option",
      "Account manager",
      "Volume discounts",
      "API integration"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const ADD_ONS = [
  {
    name: "360° Product View",
    price: "$100",
    description: "Interactive spin with 36-72 frames"
  },
  {
    name: "Model/Hand Shots",
    price: "$75",
    description: "Show scale and usage with hands or model"
  },
  {
    name: "Rush Processing",
    price: "+50%",
    description: "24-hour turnaround guarantee"
  },
  {
    name: "Video (15s)",
    price: "$150",
    description: "Short product video for social media"
  }
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold tracking-wider uppercase mb-6">
              <span>•</span>
              <span>Simple Pricing</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Transparent Pricing,
              <br />
              <span className="text-[#E63946]">Exceptional Value</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Professional product photography that fits your budget. No hidden fees,
              no surprises. Just stunning photos that drive sales.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 md:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {PRICING_TIERS.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-3xl border-2 ${
                    tier.popular
                      ? 'border-[#E63946] shadow-2xl shadow-[#E63946]/20 scale-105'
                      : 'border-gray-200'
                  } p-8 bg-white`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#E63946] text-white text-sm font-bold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${tier.popular ? 'bg-[#E63946]' : 'bg-gray-100'} ${tier.popular ? 'text-white' : 'text-gray-900'} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tier.description}</p>

                    <div className="mb-2">
                      <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                    </div>
                    <div className="text-gray-500 text-sm">{tier.unit}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${tier.popular ? 'text-[#E63946]' : 'text-emerald-500'} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.name === "Enterprise" ? "/contact" : "/order"}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 ${
                      tier.popular
                        ? 'bg-[#E63946] text-white hover:bg-[#D62839]'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } font-semibold rounded-full transition-all`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your photography package with these optional extras
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADD_ONS.map((addon, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#E63946] hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-[#E63946] mb-2">{addon.price}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Pricing FAQ
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Do you offer volume discounts?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! For orders of 50+ products, we offer significant volume discounts. Contact our sales team for custom pricing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                What's included in "retouching"?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All packages include basic retouching: color correction, background removal, dust removal, and minor imperfections. Advanced retouching includes wrinkle removal, complex masking, and creative compositing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Can I mix and match packages?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely! You can choose different packages for different products based on your needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                What if I need more revisions?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Professional and Enterprise packages include unlimited revisions. Starter package includes 2 revision rounds. Additional revisions are $15 each.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gray-900 text-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Ship your products today and get professional photos in 3-5 days
          </p>
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E63946] text-white text-lg font-semibold rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
          >
            Start Your Order
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
