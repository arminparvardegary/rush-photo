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
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        pricePerAngle: 25,
      },
      {
        id: "top-down",
        name: "Top Down",
        description: "Bird's eye view photography, ideal for flat-lay compositions",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        pricePerAngle: 25,
      },
      {
        id: "angled",
        name: "Angled",
        description: "Dynamic 45° angle shots that add depth and dimension",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
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
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      price: 25,
    },
    {
      id: "back",
      name: "Back",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
      price: 25,
    },
    {
      id: "left",
      name: "Left Side",
      image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop",
      price: 25,
    },
    {
      id: "right",
      name: "Right Side",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop",
      price: 25,
    },
  ],
};


