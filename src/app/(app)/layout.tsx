import Link from 'next/link';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-indigo-600">SeatFlow</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/rooms" className="hover:text-indigo-600 transition-colors">
                Rooms
              </Link>
              <Link href="/bookings" className="hover:text-indigo-600 transition-colors">
                Public Bookings
              </Link>
              <Link href="/health" className="hover:text-indigo-600 transition-colors">
                Diagnostics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Admin link can be placed here if needed */}
          </div>
        </div>
        {/* Mobile Nav Links Container */}
        <div className="border-t border-slate-100 bg-slate-50 py-2 px-4 md:hidden flex justify-around text-xs font-semibold text-slate-600">
          <Link href="/rooms" className="hover:text-indigo-600 py-1 px-2">Rooms</Link>
          <Link href="/bookings" className="hover:text-indigo-600 py-1 px-2">Bookings</Link>
          <Link href="/health" className="hover:text-indigo-600 py-1 px-2">Diagnostics</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SeatFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
