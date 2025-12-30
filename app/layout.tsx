import type { Metadata, Viewport } from "next";
import "./globals.css";

// SEO Configuration
export const metadata: Metadata = {
  // Basic Meta
  title: {
    default: "Rush Photo | Professional Product Photography Service",
    template: "%s | Rush Photo",
  },
  description: "Professional product photography service with 4 unique styles. Ship your product, receive magazine-quality photos in 3-5 days. 500+ brands trust Rush Photo for stunning ecommerce photos that increase conversions by 94%.",
  keywords: [
    "product photography",
    "professional photography",
    "ecommerce photography",
    "Amazon product photos",
    "product photos for Shopify",
    "commercial photography",
    "studio photography",
    "flat lay photography",
    "lifestyle product photography",
    "white background photography",
    "product photo service",
    "Rush Photo",
    "Rush Graphics",
  ],
  authors: [{ name: "Rush Photo", url: "https://rush.photos" }],
  creator: "Rush Graphics",
  publisher: "Rush Photo",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rush.photos",
    siteName: "Rush Photo",
    title: "Professional Product Photography | Rush Photo",
    description: "Transform your product photos with professional studio quality. 4 unique styles, 3-5 day turnaround, 94% conversion increase. Trusted by 500+ brands.",
    images: [
      {
        url: "https://rush.photos/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rush Photo - Professional Product Photography",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Professional Product Photography | Rush Photo",
    description: "Transform your product photos with professional studio quality. 4 unique styles, 3-5 day turnaround. Trusted by 500+ brands.",
    images: ["https://rush.photos/twitter-image.jpg"],
    creator: "@rushgraphics",
  },

  // Verification
  verification: {
    google: "google3fe7499eab7d2d59",
  },

  // Alternate Languages
  alternates: {
    canonical: "https://rush.photos",
    languages: {
      "en-US": "https://rush.photos",
    },
  },

  // Category
  category: "Photography",

  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Other
  other: {
    "msapplication-TileColor": "#f5a623",
    "theme-color": "#0d0d0d",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization Schema
    {
      "@type": "Organization",
      "@id": "https://rush.photos/#organization",
      name: "Rush Photo",
      alternateName: "Rush Photos",
      url: "https://rush.photos",
      logo: {
        "@type": "ImageObject",
        url: "https://rush.photos/logo.png",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://www.facebook.com/rushgraphics",
        "https://www.instagram.com/rushgraphics",
        "https://twitter.com/rushgraphics",
        "https://www.linkedin.com/company/rushgraphics",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-973-427-9393",
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: "English",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "1122 Goffle Rd.",
        addressLocality: "Hawthorne",
        addressRegion: "NJ",
        postalCode: "07506",
        addressCountry: "US",
      },
    },
    // LocalBusiness Schema
    {
      "@type": "LocalBusiness",
      "@id": "https://rush.photos/#localbusiness",
      name: "Rush Photo",
      image: "https://rush.photos/studio.jpg",
      telephone: "+1-973-427-9393",
      email: "hello@rush.photos",
      url: "https://rush.photos",
      priceRange: "$89-$280",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1122 Goffle Rd.",
        addressLocality: "Hawthorne",
        addressRegion: "NJ",
        postalCode: "07506",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 40.9487,
        longitude: -74.1543,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "523",
        bestRating: "5",
        worstRating: "1",
      },
    },
    // Service Schema
    {
      "@type": "Service",
      "@id": "https://rush.photos/#service",
      name: "Professional Product Photography",
      serviceType: "Product Photography",
      provider: {
        "@id": "https://rush.photos/#organization",
      },
      description: "Professional product photography service with 4 unique styles: Top Down, Product, Diagonal, and Lifestyle. Perfect for ecommerce, Amazon, Shopify, and social media.",
      offers: [
        {
          "@type": "Offer",
          name: "Single Style Package",
          price: "89",
          priceCurrency: "USD",
          description: "1 photography style with professional retouching",
        },
        {
          "@type": "Offer",
          name: "Double Style Package",
          price: "159",
          priceCurrency: "USD",
          description: "2 photography styles with professional retouching",
        },
        {
          "@type": "Offer",
          name: "Triple Style Package",
          price: "219",
          priceCurrency: "USD",
          description: "3 photography styles with professional retouching",
        },
        {
          "@type": "Offer",
          name: "Complete Package",
          price: "280",
          priceCurrency: "USD",
          description: "All 4 photography styles with unlimited revisions and RAW files",
        },
      ],
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
    },
    // WebSite Schema with SearchAction
    {
      "@type": "WebSite",
      "@id": "https://rush.photos/#website",
      url: "https://rush.photos",
      name: "Rush Photo",
      description: "Professional Product Photography Service",
      publisher: {
        "@id": "https://rush.photos/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://rush.photos/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    // FAQ Schema for AEO
    {
      "@type": "FAQPage",
      "@id": "https://rush.photos/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does it take to receive my product photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Standard turnaround is 3-5 business days from when we receive your product. Rush delivery (24-48 hours) is available for an additional fee.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to my product after the photo shoot?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We carefully package and ship your product back to you within 24 hours of completing the shoot. Return shipping is included in all packages.",
          },
        },
        {
          "@type": "Question",
          name: "Can I request revisions on my product photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Our Triple and Complete packages include unlimited revisions. Single and Double packages include 2 revisions each.",
          },
        },
        {
          "@type": "Question",
          name: "What file formats do I receive for my product photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You'll receive high-resolution JPG files optimized for both web and print. RAW files are included with the Complete package.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer bulk discounts for product photography?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! Contact us for custom pricing on orders of 10+ products. We also offer ongoing partnership rates for brands with regular photography needs.",
          },
        },
        {
          "@type": "Question",
          name: "What if I'm not satisfied with my product photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer a 100% satisfaction guarantee. If you're not happy with the results, we'll reshoot for free or provide a full refund.",
          },
        },
        {
          "@type": "Question",
          name: "How much does professional product photography cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our packages start at $89 for a single style and go up to $280 for our complete package with all 4 photography styles. This includes professional retouching, high-resolution files, and return shipping.",
          },
        },
        {
          "@type": "Question",
          name: "What types of products do you photograph?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We photograph all types of products including electronics, cosmetics, fashion accessories, food packaging, jewelry, home goods, and more. If it fits in a box, we can photograph it professionally.",
          },
        },
      ],
    },
    // HowTo Schema for AEO
    {
      "@type": "HowTo",
      "@id": "https://rush.photos/#howto",
      name: "How to Get Professional Product Photos with Rush Photo",
      description: "A simple 4-step process to get magazine-quality product photos for your ecommerce business.",
      totalTime: "P5D",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "89-280",
      },
      step: [
        {
          "@type": "HowToStep",
          name: "Choose Your Package",
          text: "Select from our 5 packages: Single ($89), Double ($159), Triple ($219), Lifestyle ($149), or Complete ($280).",
          position: 1,
        },
        {
          "@type": "HowToStep",
          name: "Ship Your Product",
          text: "Send your product to our studio using prepaid shipping. We handle everything with care.",
          position: 2,
        },
        {
          "@type": "HowToStep",
          name: "We Photograph",
          text: "Our professional photographers capture your product in your chosen styles with studio-quality lighting.",
          position: 3,
        },
        {
          "@type": "HowToStep",
          name: "Receive Your Photos",
          text: "Get your high-resolution, retouched photos in 3-5 business days, plus your product shipped back.",
          position: 4,
        },
      ],
    },
    // BreadcrumbList Schema
    {
      "@type": "BreadcrumbList",
      "@id": "https://rush.photos/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://rush.photos",
        },
      ],
    },
  ],
};

import ScrollToTop from "@/components/ScrollToTop";
import MobileBottomNav from "@/components/MobileBottomNav";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={outfit.variable}>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans">
        {children}
        <ScrollToTop />
        <MobileBottomNav />
      </body>
    </html>
  );
}
