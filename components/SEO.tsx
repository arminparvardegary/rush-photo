// SEO Component for additional structured data
// This component provides reusable SEO patterns

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  image: string;
  sku?: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Rush Photo",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Rush Photo",
      },
    },
  };
}

export function generateReviewSchema(reviews: {
  author: string;
  rating: number;
  text: string;
  date: string;
}[]) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.text,
    datePublished: review.date,
  }));
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
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
    sameAs: [
      "https://www.facebook.com/rushgraphics",
      "https://www.instagram.com/rushgraphics",
      "https://twitter.com/rushgraphics",
    ],
  };
}

// SEO-friendly image alt text generator
export function generateImageAlt(
  productName: string,
  style: "product" | "diagonal" | "lifestyle"
): string {
  const styleDescriptions = {
    product: "professional studio shot",
    diagonal: "dynamic angled perspective",
    lifestyle: "lifestyle context shot",
  };
  
  return `${productName} - ${styleDescriptions[style]} by Rush Photo professional product photography`;
}

// Meta description generator
export function generateMetaDescription(
  topic: string,
  keywords: string[] = []
): string {
  const baseDescription = `Professional ${topic} by Rush Photo. `;
  const keywordString = keywords.length > 0 ? keywords.join(", ") + ". " : "";
  const cta = "Get stunning product photos in 3-5 days. 500+ brands trust us.";
  
  const description = baseDescription + keywordString + cta;
  
  // Truncate to 160 characters for SEO
  return description.length > 160 ? description.substring(0, 157) + "..." : description;
}

