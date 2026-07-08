'use client';

import { use, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminBookings } from '@/hooks/useAdminBookings';
import { useRooms } from '@/hooks/useRooms';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Calendar, User, Mail, Hash, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { BookingStatus, BookingQueryDto } from '@/types/api';
import Link from 'next/link';

function AdminAllBookingsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const searchParamsObject = use(searchParams);

  // Extract query filters with safe defaults
  const urlPage = Number(searchParamsObject.page) || 1;
  const urlLimit = Number(searchParamsObject.limit) || 10;
  const urlStatus = (searchParamsObject.status as BookingStatus) || undefined;
  const urlRoomId = (searchParamsObject.roomId as string) || undefined;
  const urlEmail = (searchParamsObject.customerEmail as string) || undefined;
  const urlRef = (searchParamsObject.bookingReference as string) || undefined;
  const urlSortBy = (searchParamsObject.sortBy as any) || 'createdAt';
  const urlOrder = (searchParamsObject.order as 'ASC' | 'DESC') || 'DESC';

  // Buffers for input states
  const [filterEmail, setFilterEmail] = useState(urlEmail || '');
  const [filterRef, setFilterRef] = useState(urlRef || '');

  // Room listings for search filter mapping
  const { data: rooms } = useRooms();

  // Query construct
  const filters: BookingQueryDto = {
    page: urlPage,
    limit: urlLimit,
    status: urlStatus,
    roomId: urlRoomId,
    customerEmail: urlEmail,
    bookingReference: urlRef,
    sortBy: urlSortBy,
    order: urlOrder,
  };

  // React Query request
  const { data: bookingsData, isLoading, isError, error, refetch } = useAdminBookings(filters);

  // Navigation URL synchronization
  const updateUrl = (newParams: Record<string, any>) => {
    const updated = {
      page: String(urlPage),
      limit: String(urlLimit),
      status: urlStatus || '',
      roomId: urlRoomId || '',
      customerEmail: urlEmail || '',
      bookingReference: urlRef || '',
      sortBy: urlSortBy,
      order: urlOrder,
      ...newParams,
    };

    const query = new URLSearchParams();
    Object.entries(updated).forEach(([key, val]) => {
      if (val) {
        query.set(key, String(val));
      }
    });

    router.push(`/admin?${query.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({
      customerEmail: filterEmail,
      bookingReference: filterRef,
      page: '1',
    });
  };

  const handleResetFilters = () => {
    setFilterEmail('');
    setFilterRef('');
    router.push('/admin');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    updateUrl({ page: String(newPage) });
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col text-[#FAFAFA]">
      {/* Filters card */}
      <Card className="border-white/[0.08] bg-[#111113] text-[#FAFAFA] shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Email */}
              <div className="space-y-2">
                <Label htmlFor="search-email" className="text-xs font-semibold text-[#A1A1AA]">Customer Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/[0.3]" />
                  <Input
                    id="search-email"
                    placeholder="Search email..."
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    className="pl-9 bg-[#18181B] border-white/[0.08] text-[#FAFAFA] focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Booking Reference */}
              <div className="space-y-2">
                <Label htmlFor="search-ref" className="text-xs font-semibold text-[#A1A1AA]">Booking Reference</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 h-4 w-4 text-white/[0.3]" />
                  <Input
                    id="search-ref"
                    placeholder="Search Reference..."
                    value={filterRef}
                    onChange={(e) => setFilterRef(e.target.value)}
                    className="pl-9 bg-[#18181B] border-white/[0.08] text-[#FAFAFA] focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="filter-status" className="text-xs font-semibold text-[#A1A1AA]">Status</Label>
                <Select
                  value={(urlStatus as string) || 'ALL'}
                  onValueChange={(val) => updateUrl({ status: val === 'ALL' ? '' : val, page: '1' })}
                >
                  <SelectTrigger id="filter-status" className="bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-white/[0.08] text-[#FAFAFA]">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending Review</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="FAILED">Failed / Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Room */}
              <div className="space-y-2">
                <Label htmlFor="filter-room" className="text-xs font-semibold text-[#A1A1AA]">Conference Room</Label>
                <Select
                  value={urlRoomId || 'ALL'}
                  onValueChange={(val) => updateUrl({ roomId: val === 'ALL' ? '' : val, page: '1' })}
                >
                  <SelectTrigger id="filter-room" className="bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                    <SelectValue placeholder="All Rooms" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-white/[0.08] text-[#FAFAFA]">
                    <SelectItem value="ALL">All Rooms</SelectItem>
                    {rooms?.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/[0.08] items-end">
              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sort-by" className="text-xs font-semibold text-[#A1A1AA]">Sort By</Label>
                <Select
                  value={urlSortBy}
                  onValueChange={(val) => updateUrl({ sortBy: val })}
                >
                  <SelectTrigger id="sort-by" className="bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                    <SelectValue placeholder="Sort field" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-white/[0.08] text-[#FAFAFA]">
                    <SelectItem value="createdAt">Date Requested</SelectItem>
                    <SelectItem value="startDate">Start Date</SelectItem>
                    <SelectItem value="customerName">Customer Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="sort-order" className="text-xs font-semibold text-[#A1A1AA]">Order</Label>
                <Select
                  value={urlOrder}
                  onValueChange={(val) => updateUrl({ order: val })}
                >
                  <SelectTrigger id="sort-order" className="bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-white/[0.08] text-[#FAFAFA]">
                    <SelectItem value="DESC">Descending</SelectItem>
                    <SelectItem value="ASC">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Limit */}
              <div className="space-y-2">
                <Label htmlFor="filter-limit" className="text-xs font-semibold text-[#A1A1AA]">Limit</Label>
                <Select
                  value={String(urlLimit)}
                  onValueChange={(val) => updateUrl({ limit: val, page: '1' })}
                >
                  <SelectTrigger id="filter-limit" className="bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111113] border-white/[0.08] text-[#FAFAFA]">
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-semibold">
                  <Search className="h-4 w-4 mr-1.5" /> Search
                </Button>
                <Button
                  type="button"
                  onClick={handleResetFilters}
                  variant="outline"
                  className="border-white/[0.08] bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA]"
                >
                  <RotateCcw className="h-4 w-4 mr-1" /> Reset
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Grid List */}
      {isLoading ? (
        <div className="py-20 text-center text-[#A1A1AA] flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-[#7C3AED]" />
          <span>Retrieving admin records...</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
          <h3 className="mt-4 text-lg font-bold text-[#FAFAFA]">API Connection Failure</h3>
          <p className="mt-2 text-sm text-[#A1A1AA]">{(error as Error)?.message || 'Check your Admin Token or database connectivity.'}</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-6 font-semibold flex items-center gap-2 mx-auto border-white/[0.08] text-[#FAFAFA]">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      ) : !bookingsData || bookingsData.data.length === 0 ? (
        <div className="text-center py-20 text-[#A1A1AA] border border-dashed border-white/[0.08] rounded-xl bg-[#111113]">
          <Calendar className="mx-auto h-12 w-12 text-white/[0.1] mb-2" />
          <h3 className="font-bold text-[#FAFAFA]">No Bookings Found</h3>
          <p className="text-sm text-[#A1A1AA] mt-1">No database records matched your search parameters.</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#111113] shadow-sm">
            <Table>
              <TableHeader className="bg-[#18181B] border-b border-white/[0.08]">
                <TableRow className="border-b border-white/[0.08]">
                  <TableHead className="w-[180px] font-semibold text-[#FAFAFA]">Reference</TableHead>
                  <TableHead className="font-semibold text-[#FAFAFA]">Room</TableHead>
                  <TableHead className="font-semibold text-[#FAFAFA]">Customer</TableHead>
                  <TableHead className="font-semibold text-[#FAFAFA]">Dates Requested</TableHead>
                  <TableHead className="font-semibold text-[#FAFAFA]">Type</TableHead>
                  <TableHead className="font-semibold text-[#FAFAFA]">Status</TableHead>
                  <TableHead className="w-[100px] text-right font-semibold text-[#FAFAFA]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingsData.data.map((booking) => (
                  <TableRow key={booking.bookingId} className="border-b border-white/[0.04] hover:bg-[#18181B]/50 transition-colors">
                    <TableCell className="font-mono font-bold text-[#FAFAFA]">
                      {booking.bookingReference}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#FAFAFA]">{booking.room?.name}</span>
                    </TableCell>
                    <TableCell className="space-y-0.5">
                      <div className="font-medium text-[#FAFAFA]">{booking.customerName}</div>
                      <div className="text-xs text-[#A1A1AA]">{booking.customerEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm text-[#A1A1AA]">
                      {format(new Date(booking.startDate), 'MMM d')} &mdash;{' '}
                      {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-[#18181B] border-white/[0.08] text-[#FAFAFA]">
                        {booking.bookingType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-[#22C55E] border-emerald-500/20 hover:bg-emerald-500/10'
                            : booking.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/bookings/${booking.bookingId}`}>
                        <Button size="sm" variant="outline" className="border-white/[0.08] bg-[#18181B] text-[#FAFAFA] hover:bg-white/[0.04] h-8 flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5 text-[#A1A1AA]" /> Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-sm text-[#A1A1AA]">
            <div>
              Showing <span className="font-semibold text-[#FAFAFA]">{bookingsData.data.length}</span> of{' '}
              <span className="font-semibold text-[#FAFAFA]">{bookingsData.meta.totalItems}</span> bookings
            </div>
            <div className="flex items-center gap-4">
              <span>
                Page <span className="font-semibold text-[#FAFAFA]">{bookingsData.meta.page}</span> of{' '}
                <span className="font-semibold text-[#FAFAFA]">{bookingsData.meta.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(urlPage - 1)}
                  disabled={!bookingsData.meta.hasPreviousPage}
                  variant="outline"
                  size="sm"
                  className="border-white/[0.08] bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button
                  onClick={() => handlePageChange(urlPage + 1)}
                  disabled={!bookingsData.meta.hasNextPage}
                  variant="outline"
                  size="sm"
                  className="border-white/[0.08] bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA] disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAllBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-[#A1A1AA]">Initializing admin overview table...</div>}>
      <AdminAllBookingsContent searchParams={searchParams} />
    </Suspense>
  );
}
