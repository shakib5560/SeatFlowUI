'use client';

import { use, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Calendar, User, Mail, Hash, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { BookingStatus, BookingQueryDto } from '@/types/api';

function BookingsDirectoryContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const searchParamsObject = use(searchParams);

  // Extract parameters from URL promise, providing safe fallbacks
  const urlPage = Number(searchParamsObject.page) || 1;
  const urlLimit = Number(searchParamsObject.limit) || 10;
  const urlStatus = (searchParamsObject.status as BookingStatus) || undefined;
  const urlRoomId = (searchParamsObject.roomId as string) || undefined;
  const urlEmail = (searchParamsObject.customerEmail as string) || undefined;
  const urlRef = (searchParamsObject.bookingReference as string) || undefined;
  const urlSortBy = (searchParamsObject.sortBy as any) || 'createdAt';
  const urlOrder = (searchParamsObject.order as 'ASC' | 'DESC') || 'DESC';

  // Local filter states (bound to input elements for buffer before triggering navigation)
  const [filterEmail, setFilterEmail] = useState(urlEmail || '');
  const [filterRef, setFilterRef] = useState(urlRef || '');

  // Room lists for filter dropdown
  const { data: rooms } = useRooms();

  // Create filters object matching query structure
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

  // React Query: fetch public bookings list
  const { data: bookingsData, isLoading, isError, error, refetch } = useBookings(filters);

  // Push updated filter parameters to the URL
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

    // Clean up empty params
    const query = new URLSearchParams();
    Object.entries(updated).forEach(([key, val]) => {
      if (val) {
        query.set(key, String(val));
      }
    });

    router.push(`/bookings?${query.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({
      customerEmail: filterEmail,
      bookingReference: filterRef,
      page: '1', // Reset to page 1 on new search
    });
  };

  const handleResetFilters = () => {
    setFilterEmail('');
    setFilterRef('');
    router.push('/bookings');
  };

  // Pagination triggers
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    updateUrl({ page: String(newPage) });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Public Bookings Directory</h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse and search scheduling requests submitted to SeatFlow. All records sync with search queries.
        </p>
      </div>

      {/* Filter panel */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Email search */}
              <div className="space-y-2">
                <Label htmlFor="search-email" className="text-xs font-semibold text-slate-500">Customer Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="search-email"
                    placeholder="Search email..."
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    className="pl-9 border-slate-200"
                  />
                </div>
              </div>

              {/* Booking Reference search */}
              <div className="space-y-2">
                <Label htmlFor="search-ref" className="text-xs font-semibold text-slate-500">Booking Reference</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="search-ref"
                    placeholder="Search reference (e.g. BK-)..."
                    value={filterRef}
                    onChange={(e) => setFilterRef(e.target.value)}
                    className="pl-9 border-slate-200"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-status" className="text-xs font-semibold text-slate-500">Status</Label>
                <Select
                  value={(urlStatus as string) || 'ALL'}
                  onValueChange={(val) => updateUrl({ status: val === 'ALL' ? '' : val, page: '1' })}
                >
                  <SelectTrigger id="filter-status" className="border-slate-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending Approval</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed Bookings</SelectItem>
                    <SelectItem value="FAILED">Failed Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Room Filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-room" className="text-xs font-semibold text-slate-500">Conference Room</Label>
                <Select
                  value={urlRoomId || 'ALL'}
                  onValueChange={(val) => updateUrl({ roomId: val === 'ALL' ? '' : val, page: '1' })}
                >
                  <SelectTrigger id="filter-room" className="border-slate-200">
                    <SelectValue placeholder="All Rooms" />
                  </SelectTrigger>
                  <SelectContent>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 items-end">
              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sort-by" className="text-xs font-semibold text-slate-500">Sort By</Label>
                <Select
                  value={urlSortBy}
                  onValueChange={(val) => updateUrl({ sortBy: val })}
                >
                  <SelectTrigger id="sort-by" className="border-slate-200">
                    <SelectValue placeholder="Sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Requested</SelectItem>
                    <SelectItem value="startDate">Start Date</SelectItem>
                    <SelectItem value="customerName">Customer Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="sort-order" className="text-xs font-semibold text-slate-500">Order</Label>
                <Select
                  value={urlOrder}
                  onValueChange={(val) => updateUrl({ order: val })}
                >
                  <SelectTrigger id="sort-order" className="border-slate-200">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DESC">Descending</SelectItem>
                    <SelectItem value="ASC">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Items Per Page */}
              <div className="space-y-2">
                <Label htmlFor="filter-limit" className="text-xs font-semibold text-slate-500">Limit</Label>
                <Select
                  value={String(urlLimit)}
                  onValueChange={(val) => updateUrl({ limit: val, page: '1' })}
                >
                  <SelectTrigger id="filter-limit" className="border-slate-200">
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                  <Search className="h-4 w-4 mr-1.5" /> Apply Filters
                </Button>
                <Button
                  type="button"
                  onClick={handleResetFilters}
                  variant="outline"
                  className="border-slate-200 text-slate-500 hover:text-slate-900"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span>Retrieving booking database records...</span>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h3 className="mt-4 text-lg font-bold text-rose-900">Connection Error</h3>
          <p className="mt-2 text-sm text-rose-600">{(error as Error)?.message || 'Could not fetch records.'}</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-6 font-semibold flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      ) : !bookingsData || bookingsData.data.length === 0 ? (
        <div className="text-center py-20 text-slate-500 border border-dashed rounded-xl bg-white">
          <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-700">No Bookings Found</h3>
          <p className="text-sm text-slate-500 mt-1">Try modifying your filter parameters or select a different room.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[180px] font-semibold">Booking Reference</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Period</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Requested On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingsData.data.map((booking) => (
                  <TableRow key={booking.bookingReference} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono font-bold text-slate-900">
                      {booking.bookingReference}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-indigo-600">{booking.room?.name || 'Unknown'}</span>
                    </TableCell>
                    <TableCell className="space-y-0.5">
                      <div className="font-medium text-slate-950 flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-400" /> {booking.customerName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" /> {booking.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {format(new Date(booking.startDate), 'MMM d, yyyy')} &mdash;{' '}
                      {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-300">
                        {booking.bookingType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                            : booking.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-50'
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500 font-mono">
                      {format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-900">{bookingsData.data.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{bookingsData.meta.totalItems}</span> bookings
            </div>
            <div className="flex items-center gap-4">
              <span>
                Page <span className="font-semibold text-slate-900">{bookingsData.meta.page}</span> of{' '}
                <span className="font-semibold text-slate-900">{bookingsData.meta.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(urlPage - 1)}
                  disabled={!bookingsData.meta.hasPreviousPage}
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(urlPage + 1)}
                  disabled={!bookingsData.meta.hasNextPage}
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
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

export default function BookingsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Initializing bookings table...</div>}>
      <BookingsDirectoryContent searchParams={searchParams} />
    </Suspense>
  );
}
