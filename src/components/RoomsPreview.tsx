'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Projector, Video, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const sampleRooms = [
  {
    id: 'A101',
    name: 'A101',
    type: 'Conference Room',
    capacity: 8,
    facility: 'Projector',
    facilityIcon: Projector,
    status: 'Available Today',
    statusStyle: 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20',
  },
  {
    id: 'B205',
    name: 'B205',
    type: 'Creative Room',
    capacity: 6,
    facility: 'Whiteboard',
    facilityIcon: HelpCircle, // fallback icon since we can represent whiteboard with board/edit/pen or similar
    status: 'Booked',
    statusStyle: 'bg-white/[0.04] text-[#A1A1AA] border-white/[0.08]',
  },
  {
    id: 'C301',
    name: 'C301',
    type: 'Executive Suite',
    capacity: 12,
    facility: 'Video Conference',
    facilityIcon: Video,
    status: 'Available Tomorrow',
    statusStyle: 'bg-[#7C3AED]/10 text-[#8B5CF6] border-[#7C3AED]/20',
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

export default function RoomsPreview() {
  return (
    <section className="py-20 bg-[#09090B] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight">
              Featured Meeting Spaces
            </h2>
            <p className="mt-4 text-[#A1A1AA] text-base sm:text-lg">
              Explore some of our most popular, fully-equipped meeting rooms designed to foster collaboration.
            </p>
          </div>
          <Link href="/rooms" className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] hover:text-[#8B5CF6] transition-colors group">
            Explore All Rooms
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Rooms Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {sampleRooms.map((room) => {
            const FacIcon = room.facilityIcon;
            return (
              <motion.div
                key={room.id}
                variants={cardVariants}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-[#111113] border border-white/[0.06] hover:bg-[#18181B] hover:border-white/[0.12] transition-all duration-300"
              >
                <div>
                  {/* Status Badge & Room Identifier */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                        {room.type}
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#FAFAFA] tracking-tight">
                        {room.name}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${room.statusStyle}`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Room Details Grid */}
                  <div className="space-y-3.5 mb-8">
                    <div className="flex items-center gap-3 text-[#A1A1AA]">
                      <Users className="h-4.5 w-4.5 text-white/[0.3]" />
                      <span className="text-sm font-medium">Fits up to {room.capacity} people</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#A1A1AA]">
                      <FacIcon className="h-4.5 w-4.5 text-white/[0.3]" />
                      <span className="text-sm font-medium">{room.facility} available</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Link href="/rooms" className="block mt-auto w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 border border-white/[0.08] hover:border-[#7C3AED]/30 bg-[#18181B] group-hover:bg-[#7C3AED] text-[#FAFAFA] py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300">
                    Book Space
                    <ArrowRight className="h-4 w-4 text-[#A1A1AA] group-hover:text-white transform group-hover:translate-x-0.5 transition-all" />
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
