export interface PricingStyle {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerAngle: number;
}

export interface PricingAngle {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface PricingSettings {
  ecommerce: {
    perAngle: number;
    styles: PricingStyle[];
  };
  lifestyle: {
    flatRate: number;
  };
  /**
   * Percent value (e.g. 10 means 10%)
   */
  fullPackageDiscount: number;
  angles: PricingAngle[];
}

export const DEFAULT_PRICING: PricingSettings = {
  ecommerce: {
    perAngle: 25,
    styles: [
      {
        id: "straight-on",
        name: "Straight On",
        description: "Direct front-facing shots, perfect for showcasing product details",
        image: "/images/portfolio/speakers.jpg",
        pricePerAngle: 25,
      },
      {
        id: "angled",
        name: "Angled",
        description: "Dynamic 45° angle shots that add depth and dimension",
        image: "/images/portfolio/sneaker.jpg",
        pricePerAngle: 25,
      },
    ],
  },
  lifestyle: {
    flatRate: 149,
  },
  fullPackageDiscount: 10,
  angles: [
    {
      id: "front",
      name: "Front",
      image: "/images/portfolio/speakers.jpg",
      price: 25,
    },
    {
      id: "back",
      name: "Back",
      image: "/images/portfolio/pink-bottle.jpg",
      price: 25,
    },
    {
      id: "left",
      name: "Left Side",
      image: "/images/portfolio/serum-bottle.jpg",
      price: 25,
    },
    {
      id: "right",
      name: "Right Side",
      image: "/images/portfolio/black-sprayer.jpg",
      price: 25,
    },
  ],
};


