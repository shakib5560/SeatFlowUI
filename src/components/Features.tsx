'use client';

import { motion } from 'framer-motion';
import { Eye, Calendar, ShieldCheck, Layers } from 'lucide-react';

const features = [
  {
    title: 'Real-Time Availability',
    description: 'Instantly see which meeting rooms are available before making a reservation.',
    icon: Eye,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'hover:border-emerald-500/20',
  },
  {
    title: 'Flexible Scheduling',
    description: "Book rooms by the hour, day, or week depending on your team's needs.",
    icon: Calendar,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/5',
    border: 'hover:border-indigo-500/20',
  },
  {
    title: 'Booking Approval',
    description: 'Submit booking requests and receive confirmation once approved by administrators.',
    icon: ShieldCheck,
    color: 'text-purple-400',
    bg: 'bg-purple-500/5',
    border: 'hover:border-purple-500/20',
  },
  {
    title: 'Organized Workspace',
    description: 'Keep meetings structured with an easy-to-use reservation system.',
    icon: Layers,
    color: 'text-sky-400',
    bg: 'bg-sky-500/5',
    border: 'hover:border-sky-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Features() {
  return (
    <section className="py-20 bg-[#09090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight">
            Designed for Modern Teams
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-base sm:text-lg">
            Everything you need to manage your workspaces, streamline meeting coordination, and maximize productivity.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`group relative p-8 rounded-2xl bg-[#111113] border border-white/[0.06] ${feature.border} transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#18181B]`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(400px_circle_at_var(--x,0px)_var(--y,0px),rgba(255,255,255,0.03),transparent)]" />

                {/* Icon Wrapper */}
                <div className={`inline-flex items-center justify-center p-3.5 rounded-xl ${feature.bg} ${feature.color} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#FAFAFA] tracking-tight mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
