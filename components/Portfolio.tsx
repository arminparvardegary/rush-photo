"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Eye, X, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Noir Collection",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop&q=90",
    stats: "+45% AOV",
  },
  {
    id: 2,
    title: "Sonic Pulse",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=90",
    stats: "Featured on Behance",
  },
  {
    id: 3,
    title: "Urban Steps",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=90",
    stats: "2x Click-through",
  },
  {
    id: 4,
    title: "Pure Glow",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop&q=90",
    stats: "Social Viral",
  },
  {
    id: 5,
    title: "Tech Minimal",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop&q=90",
    stats: "+120% Sales",
  },
  {
    id: 6,
    title: "Refresh",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=90",
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
    <section id="portfolio" className="relative py-32 bg-ink overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container relative z-10 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-honey mb-4"
            >
              <Layers className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">Selected Works</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 font-serif italic">Inventory</span>
            </h2>
          </div>

          <div className="flex gap-2 bg-white/5 p-1 rounded-full backdrop-blur-sm">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                    ? "bg-white text-ink shadow-lg"
                    : "text-mist hover:text-white hover:bg-white/10"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Horizontal Scroll */}
      <div ref={containerRef} className="h-[500px] md:h-[600px] relative w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
        <motion.div
          className="flex gap-8 px-4 md:px-20 min-w-max"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative group w-[300px] md:w-[400px] aspect-[4/5] perspective-1000 cursor-pointer"
              onClick={() => setSelectedItem(item)}
              whileHover={{ y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 bg-charcoal"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ rotateY: 5 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />

                {/* Overlay Info */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="transform translate-z-20"
                  >
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-honey text-xs font-bold tracking-widest uppercase mb-2 block">{item.category}</span>
                        <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4" />
                          {item.stats}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-honey group-hover:text-ink transition-colors">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* CTA Card */}
          <div className="w-[300px] md:w-[400px] aspect-[4/5] flex items-center justify-center">
            <a href="/order" className="group text-center">
              <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-honey group-hover:border-honey transition-all duration-500">
                <ArrowUpRight className="w-8 h-8 text-white group-hover:text-ink transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">View All Works</h3>
              <p className="text-mist">Explore our full archive</p>
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
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full h-full max-h-[90vh] grid md:grid-cols-2 gap-8 bg-charcoal rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full min-h-[400px]">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <span className="text-honey text-sm font-bold tracking-widest uppercase mb-4">{selectedItem.category}</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{selectedItem.title}</h3>
                <p className="text-lg text-mist mb-8 leading-relaxed">
                  Shot in our premium studio using Phase One camera systems.
                  This project required specific attention to lighting to highlight the textures and materials.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-mist mb-1">Impact</p>
                    <p className="text-xl font-bold text-white">{selectedItem.stats}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-mist mb-1">Deliverables</p>
                    <p className="text-xl font-bold text-white">12 - 15 Photos</p>
                  </div>
                </div>

                <a
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-white text-ink font-bold rounded-full hover:bg-honey transition-colors"
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
