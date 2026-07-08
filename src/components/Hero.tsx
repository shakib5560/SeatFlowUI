'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarRange } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#111113] backdrop-blur-md mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">
            Trusted workspace booking platform
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#FAFAFA] leading-[1.1] max-w-4xl mx-auto"
        >
          Book Meeting Rooms <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA] to-[#7C3AED]">
            Without the Chaos
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Find available meeting rooms in seconds, request bookings effortlessly, and keep your team's schedule organized—all from one simple workspace.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/rooms" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#FAFAFA] px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-[#7C3AED]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              <CalendarRange className="h-5 w-5" />
              Book a Room
            </button>
          </Link>
          <Link href="/rooms" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA] px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
              Browse Rooms
              <ArrowRight className="h-4 w-4 text-[#A1A1AA]" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </section>
  );
}
