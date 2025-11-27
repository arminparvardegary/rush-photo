"use client";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, Luxe Skincare",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    text: "Rush transformed our product photos completely. Sales increased 40% after updating our website with their images!",
    rating: 5,
  },
  {
    name: "Mike Johnson",
    role: "CEO, TechGear Co",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    text: "The quality is unmatched. Fast turnaround and the team really understands what makes products look amazing.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Brand Manager, Fit+",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    text: "Best investment we made for our brand. The lifestyle shots especially helped us connect with our audience.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#fff5eb] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 right-20 text-[200px] font-bold text-[#E54A4A]/5 select-none">
        "
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            What Clients Say
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Loved by <span className="gradient-text">500+ brands</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#E54A4A]/5 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-[#1a1a1a]/70 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E54A4A]/20"
                />
                <div>
                  <div className="font-semibold text-[#1a1a1a]">{testimonial.name}</div>
                  <div className="text-sm text-[#1a1a1a]/50">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
