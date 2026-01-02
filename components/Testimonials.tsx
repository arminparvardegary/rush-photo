"use client";

import { motion } from "framer-motion";
import { Star, Quote, Play } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Marketing Director",
    company: "Luxe Skin",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    content: "The quality of the photos blew us away. Our conversion rate increased by 40% after updating our product pages.",
    rating: 5,
    type: "text"
  },
  {
    id: 2,
    name: "David Chen",
    role: "Founder",
    company: "TechGear",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    content: "Fastest turnaround in the industry without compromising on quality. The team understood our brand aesthetic perfectly.",
    rating: 5,
    type: "video",
    videoThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Brand Manager",
    company: "Organic Life",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
    content: "Professional, responsive, and incredibly talented. Rush Photos has become our go-to partner for all visual content.",
    rating: 5,
    type: "text"
  },
  {
    id: 4,
    name: "Michael Ross",
    role: "E-commerce Lead",
    company: "FitFlex",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    content: "They made our products look million-dollar worthy. The investment paid off in the first week of launch.",
    rating: 5,
    type: "text"
  },
  {
    id: 5,
    name: "Jessica Lee",
    role: "Creative Director",
    company: "Modern Home",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
    content: "The attention to detail is unmatched. Every shadow, every highlight is intentional. Truly world-class work.",
    rating: 5,
    type: "video",
    videoThumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-32 bg-rush-light overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold text-rush-dark mb-6 tracking-tighter">
              Client <span className="text-[#E63946]">Love</span>
            </h2>
            <p className="text-lg text-rush-gray font-medium">
              Don't just take our word for it. Trusted by over 500+ brands worldwide.
            </p>
          </motion.div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid"
            >
              <div className={`relative p-8 rounded-3xl border transition-colors duration-500 overflow-hidden ${item.type === 'video' ? 'bg-black border-black text-white' : 'bg-white border-rush-border hover:border-[#E63946]/20'}`}>
                {item.type === 'video' ? (
                  <>
                    <div className="absolute inset-0 opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                      <img src={item.videoThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-64 text-center">
                      <button className="w-16 h-16 rounded-full bg-[#E63946]/90 flex items-center justify-center mb-6 hover:scale-110 transition-transform shadow-xl shadow-[#E63946]/20">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </button>
                      <p className="font-serif italic text-2xl text-white">"{item.content}"</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#E63946] fill-current" />
                      ))}
                    </div>

                    <Quote className="w-8 h-8 text-rush-gray/10 mb-6" />

                    <p className="text-lg text-rush-gray leading-relaxed mb-8 font-medium">
                      "{item.content}"
                    </p>
                  </>
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-12 h-12 rounded-full object-cover ring-2 ${item.type === 'video' ? 'ring-white/10' : 'ring-rush-border'}`}
                  />
                  <div>
                    <h4 className={`font-bold text-sm ${item.type === 'video' ? 'text-white' : 'text-rush-dark'}`}>{item.name}</h4>
                    <p className={`text-xs ${item.type === 'video' ? 'text-white/60' : 'text-rush-gray'}`}>{item.role}, {item.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
