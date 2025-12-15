"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import { useState } from "react";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Premium Watch Collection",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop&q=90",
    span: "row-span-2",
  },
  {
    id: 2,
    title: "Audio Equipment",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=90",
    span: "",
  },
  {
    id: 3,
    title: "Sneaker Launch",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=90",
    span: "",
  },
  {
    id: 4,
    title: "Skincare Line",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop&q=90",
    span: "",
  },
  {
    id: 5,
    title: "Tech Accessories",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop&q=90",
    span: "row-span-2",
  },
  {
    id: 6,
    title: "Beverage Brand",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=90",
    span: "",
  },
];

const CATEGORIES = ["All", "E-commerce", "Lifestyle"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-32 bg-ink overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-4">
              Our <span className="text-gradient font-serif italic">work</span>
            </h2>
            <p className="text-lg text-mist max-w-xl">
              A curated selection of product photography for brands across industries.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-honey text-ink"
                    : "bg-white/5 text-mist hover:bg-white/10 hover:text-cloud"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Grid - Masonry-like */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={item.span}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative group h-full min-h-[250px] sm:min-h-[300px] rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hoveredItem === item.id ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent transition-opacity duration-300 ${
                    hoveredItem === item.id ? "opacity-90" : "opacity-60"
                  }`}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div
                    className={`transition-all duration-300 ${
                      hoveredItem === item.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-80"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-honey/20 text-honey text-xs font-medium mb-3">
                      {item.category}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-cloud mb-2">
                      {item.title}
                    </h3>
                  </div>

                  {/* View button */}
                  <div
                    className={`transition-all duration-300 ${
                      hoveredItem === item.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-honey hover:text-honey-light transition-colors mt-3">
                      <Eye className="w-4 h-4" />
                      View Project
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-mist hover:text-honey transition-colors font-medium"
          >
            See more of our work
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
