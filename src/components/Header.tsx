'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, CalendarRange, Shield } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090B]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[#09090B]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-[#FAFAFA] hover:text-[#7C3AED] transition-colors">
                SeatFlow
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/rooms" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
              Rooms
            </Link>
            <Link href="/bookings" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
              Bookings
            </Link>
            <Link href="/admin" className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/rooms">
              <button className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#FAFAFA] px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200">
                <CalendarRange className="h-3.5 w-3.5" />
                Book Space
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.04] focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-white/[0.06] bg-[#09090B] overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/rooms"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] py-2 transition-colors"
              >
                Rooms
              </Link>
              <Link
                href="/bookings"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] py-2 transition-colors"
              >
                Bookings
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] py-2 transition-colors flex items-center gap-1.5"
              >
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
              <div className="pt-4 border-t border-white/[0.06]">
                <Link href="/rooms" onClick={() => setIsOpen(false)} className="block w-full">
                  <button className="w-full inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#FAFAFA] py-3 rounded-xl text-sm font-semibold shadow-md transition-all">
                    <CalendarRange className="h-4 w-4" />
                    Book Space
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
