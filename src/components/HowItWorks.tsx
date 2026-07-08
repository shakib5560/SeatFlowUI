'use client';

import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Browse Rooms',
    description: 'Explore our selection of available spaces tailored to your meeting sizes and setup needs.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Choose Time',
    description: 'Select your preferred date, duration, and time slots directly on our live calendar.',
    icon: Clock,
  },
  {
    number: '03',
    title: 'Request Booking',
    description: 'Submit your request. The system notifies administrators and confirms your slot instantly.',
    icon: CheckCircle,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#09090B] relative overflow-hidden">
      {/* Subtle bottom gradient shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-base sm:text-lg">
            Reserve the perfect workspace for your team in three seamless steps.
          </p>
        </div>

        {/* Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={stepVariants}
                className="flex flex-col items-center text-center px-4"
              >
                {/* Step Circle Indicator */}
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-[#111113] border border-white/[0.08] flex items-center justify-center text-[#7C3AED] shadow-md group-hover:scale-105 transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="absolute -top-3.5 -right-3.5 text-xs font-mono font-bold text-white/[0.15] bg-[#09090B] border border-white/[0.04] px-2 py-0.5 rounded-md">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-bold text-[#FAFAFA] tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
