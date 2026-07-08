'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090B] border-t border-white/[0.04] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-lg tracking-tight text-[#FAFAFA]">
              SeatFlow
            </span>
            <p className="text-xs text-[#A1A1AA]">
              &copy; {currentYear} SeatFlow. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-[#A1A1AA]">
            <Link href="/rooms" className="hover:text-[#FAFAFA] transition-colors">
              Rooms
            </Link>
            <Link href="/bookings" className="hover:text-[#FAFAFA] transition-colors">
              Bookings
            </Link>
            <Link href="#" className="hover:text-[#FAFAFA] transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-[#FAFAFA] transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-[#FAFAFA] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#FAFAFA] transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
