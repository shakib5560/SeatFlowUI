'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '10+', label: 'Meeting Rooms' },
  { value: '500+', label: 'Bookings Completed' },
  { value: '99%', label: 'Successful Reservations' },
  { value: '24/7', label: 'Availability' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-[#09090B] border-t border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA] tracking-tight mb-2">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
