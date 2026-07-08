'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarRange, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-[#09090B] relative">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 sm:p-16 rounded-3xl bg-[#111113] border border-white/[0.06] text-center relative overflow-hidden"
        >
          {/* Subtle overlay card grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] -z-10" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAFAFA] tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to Coordinate Your Space?
          </h2>
          <p className="mt-6 text-[#A1A1AA] text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            Experience frictionless room scheduling. Check real-time room status and secure your space in just a few clicks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rooms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#FAFAFA] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-[#7C3AED]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                <CalendarRange className="h-5 w-5" />
                Book a Room
              </button>
            </Link>
            <Link href="/bookings" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-[#18181B] hover:bg-white/[0.04] text-[#FAFAFA] px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                Track Bookings
                <ArrowRight className="h-4 w-4 text-[#A1A1AA]" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
