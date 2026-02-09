"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Camera, Award } from "lucide-react";

const STATS = [
  {
    icon: Camera,
    value: "15,000+",
    label: "Products Photographed",
    change: "+127%",
    color: "text-[#E63946]",
    bgColor: "bg-[#E63946]/10"
  },
  {
    icon: Users,
    value: "500+",
    label: "Happy Clients",
    change: "+95%",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10"
  },
  {
    icon: TrendingUp,
    value: "45%",
    label: "Avg. Sales Increase",
    change: "Client Results",
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10"
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Client Satisfaction",
    change: "500+ Reviews",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10"
  }
];

const CHART_DATA = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 35 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 60 },
  { month: "May", value: 75 },
  { month: "Jun", value: 85 },
];

export default function StatsChart() {
  const maxValue = Math.max(...CHART_DATA.map(d => d.value));

  return (
    <section className="relative py-24 md:py-32 bg-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold tracking-wider uppercase mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Results that speak <br />
              <span className="text-[#E63946]">for themselves</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              See how professional product photography transforms businesses and drives real growth
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-[#E63946]/50 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                <div className={`text-xs font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Client Growth Trend</h3>
              <p className="text-gray-400">Average sales increase after using our photography</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-500">+127%</div>
              <div className="text-sm text-gray-400">Last 6 months</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between gap-4">
              {CHART_DATA.map((data, index) => {
                const heightPercent = (data.value / maxValue) * 100;
                return (
                  <motion.div
                    key={data.month}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${heightPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="flex-1 relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E63946] to-[#E63946]/50 rounded-t-lg group-hover:from-[#E63946] group-hover:to-[#E63946]/70 transition-all duration-300" />

                    {/* Value Label */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {data.value}%
                    </motion.div>

                    {/* Month Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 font-medium">
                      {data.month}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E63946]" />
              <span className="text-gray-400">Sales Growth %</span>
            </div>
            <div className="text-gray-500">Data from 500+ verified clients</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
