"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Eye, X, Layers } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Urban Steps",
    category: "E-commerce",
    image: "/images/portfolio/sneaker.jpg",
    stats: "+45% AOV",
  },
  {
    id: 2,
    title: "Leather Comfort",
    category: "E-commerce",
    image: "/images/portfolio/sandal.jpg",
    stats: "Featured on Behance",
  },
  {
    id: 3,
    title: "Pure Glow",
    category: "E-commerce",
    image: "/images/portfolio/serum-bottle.jpg",
    stats: "2x Click-through",
  },
  {
    id: 4,
    title: "Sonic Speakers",
    category: "E-commerce",
    image: "/images/portfolio/speakers.jpg",
    stats: "Social Viral",
  },
  {
    id: 5,
    title: "Creative Tools",
    category: "Lifestyle",
    image: "/images/portfolio/photography-tools.jpg",
    stats: "+120% Sales",
  },
  {
    id: 6,
    title: "Floral Elegance",
    category: "Lifestyle",
    image: "/images/portfolio/flowers-table.jpg",
    stats: "Award Winning",
  },
];

const CATEGORIES = ["All", "E-commerce", "Lifestyle"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof PORTFOLIO_ITEMS[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const filteredItems = activeCategory === "All"
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />

      <div className="container relative z-10 mb-12 md:mb-16 max-w-[1800px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#E63946] mb-4"
            >
              <Layers className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">Selected Works</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold text-rush-dark tracking-tighter">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E63946] to-[#FF6B6B] font-serif italic">Inventory</span>
            </h2>
          </div>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                    ? "bg-white text-rush-dark shadow-lg"
                    : "text-rush-gray hover:text-rush-dark hover:bg-white/50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Horizontal Scroll */}
      <div ref={containerRef} className="h-[500px] md:h-[600px] 3xl:h-[700px] relative w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
        <motion.div
          className="flex gap-6 md:gap-8 px-4 md:px-20 3xl:px-32 min-w-max"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative group w-[280px] md:w-[380px] 3xl:w-[450px] aspect-[4/5] cursor-pointer"
              onClick={() => setSelectedItem(item)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <motion.div
                className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg border border-gray-200 bg-white"
                whileHover={{
                  boxShadow: "0 25px 60px -12px rgba(230,57,70,0.3), 0 15px 30px -10px rgba(0,0,0,0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 280px, (max-width: 1920px) 380px, 450px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Overlay Info */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    className="transform transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-end">
                      <motion.div
                        initial={{ opacity: 0.8, y: 0 }}
                        whileHover={{ opacity: 1, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.span
                          className="text-[#E63946] text-xs font-bold tracking-widest uppercase mb-2 block"
                          initial={{ opacity: 0.9 }}
                          whileHover={{ opacity: 1, scale: 1.05 }}
                        >
                          {item.category}
                        </motion.span>
                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#E63946] transition-colors duration-300">{item.title}</h3>
                        <p className="text-white/80 text-sm flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          {item.stats}
                        </p>
                      </motion.div>
                      <motion.div
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgb(230, 57, 70)",
                          rotate: 15
                        }}
                      >
                        <Eye className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <div className="w-[280px] md:w-[380px] 3xl:w-[450px] aspect-[4/5] flex items-center justify-center">
            <a href="/order" className="group text-center">
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E63946] group-hover:border-[#E63946] transition-all duration-500">
                <ArrowUpRight className="w-8 h-8 text-rush-dark group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-rush-dark mb-2">View All Works</h3>
              <p className="text-rush-gray">Explore our full archive</p>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl 3xl:max-w-7xl w-full h-full max-h-[90vh] grid md:grid-cols-2 gap-6 md:gap-8 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full min-h-[400px]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-6 h-6 text-rush-dark" />
                </button>

                <span className="text-[#E63946] text-sm font-bold tracking-widest uppercase mb-4">{selectedItem.category}</span>
                <h3 className="text-4xl md:text-5xl font-bold text-rush-dark mb-6">{selectedItem.title}</h3>
                <p className="text-lg text-rush-gray mb-8 leading-relaxed">
                  Shot in our premium studio using Phase One camera systems.
                  This project required specific attention to lighting to highlight the textures and materials.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-xs text-rush-gray mb-1">Impact</p>
                    <p className="text-xl font-bold text-rush-dark">{selectedItem.stats}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-xs text-rush-gray mb-1">Deliverables</p>
                    <p className="text-xl font-bold text-rush-dark">12 - 15 Photos</p>
                  </div>
                </div>

                <a
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-[#E63946] text-white font-bold rounded-full hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
                >
                  Start Similar Project <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
