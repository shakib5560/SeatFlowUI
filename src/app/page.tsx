import Link from 'next/link';
import { Calendar, Shield, Activity, ListOrdered } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Welcome to SeatFlow
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-2xl">
          A secure, transactional room booking and scheduling system. Connected directly to our NestJS, Prisma, and BullMQ backend service.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/rooms"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Browse Rooms & Book
          </Link>
          <Link
            href="/bookings"
            className="rounded-lg bg-indigo-500/20 border border-indigo-400/30 px-5 py-3 text-sm font-semibold hover:bg-indigo-500/30 transition-colors"
          >
            View Existing Bookings
          </Link>
        </div>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Meeting Rooms</h2>
          <p className="mt-2 text-sm text-slate-500">
            View availability of standard conference rooms (A1 to A10) and request bookings.
          </p>
          <Link href="/rooms" className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            View Rooms &rarr;
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <ListOrdered className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Public Bookings</h2>
          <p className="mt-2 text-sm text-slate-500">
            Check the status of pending or approved bookings, with comprehensive query filters.
          </p>
          <Link href="/bookings" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500">
            View Bookings &rarr;
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">
            Approve or reject booking requests, manage queues, and review customer submissions.
          </p>
          <Link href="/admin" className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500">
            Admin Portal &rarr;
          </Link>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Health Probe</h2>
          <p className="mt-2 text-sm text-slate-500">
            Monitor API latencies, Redis database caches, and BullMQ worker queue statuses.
          </p>
          <Link href="/health" className="mt-4 inline-flex items-center text-sm font-semibold text-rose-600 hover:text-rose-500">
            Check Diagnostics &rarr;
          </Link>
        </div>
      </div>

      {/* Thin client explanation */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">System Integration Details</h3>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <li>
            <strong className="text-slate-900 block mb-1">Thin Client Architecture</strong>
            The frontend calculates no calendars locally. All availability, constraints, and room statuses are validated and resolved by the NestJS API.
          </li>
          <li>
            <strong className="text-slate-900 block mb-1">Request Idempotency</strong>
            Public bookings employ client-generated UUID v4 keys sent via headers and payload. In event of timeout, the same UUID is retried to block duplicate requests.
          </li>
          <li>
            <strong className="text-slate-900 block mb-1">State Sync</strong>
            Filters and paging parameters are synced directly with the browser URL address bar to enable direct link sharing and browser history integrity.
          </li>
        </ul>
      </div>
    </div>
  );
}
