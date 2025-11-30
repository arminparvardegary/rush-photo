import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Your Project - Get Professional Product Photos",
  description: "Order professional product photography for your ecommerce business. Choose from 5 packages starting at $89. 3-5 day turnaround, free shipping, 100% satisfaction guarantee.",
  keywords: [
    "order product photos",
    "buy product photography",
    "ecommerce photo package",
    "professional product photos pricing",
    "Amazon product photography service",
  ],
  openGraph: {
    title: "Start Your Project | Rush Photo",
    description: "Order professional product photography. 5 packages from $89-$280. Fast turnaround, free shipping, satisfaction guaranteed.",
    url: "https://rush.photos/order",
  },
  twitter: {
    title: "Start Your Project | Rush Photo",
    description: "Order professional product photography. 5 packages from $89-$280. Fast turnaround, satisfaction guaranteed.",
  },
  alternates: {
    canonical: "https://rush.photos/order",
  },
};

// JSON-LD for Order Page
const orderJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://rush.photos/order",
  name: "Order Professional Product Photography",
  description: "Start your professional product photography project with Rush Photo. Choose from 5 packages and get stunning photos in 3-5 days.",
  isPartOf: {
    "@id": "https://rush.photos/#website",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rush.photos",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Order",
        item: "https://rush.photos/order",
      },
    ],
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderJsonLd) }}
      />
      {children}
    </>
  );
}

