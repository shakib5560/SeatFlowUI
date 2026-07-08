'use client';

import { use, useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useRooms } from '@/hooks/useRooms';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { useCreateBooking } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, CheckCircle, Clock, RefreshCw, ArrowLeft, ArrowRight, User, Mail, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { toast } from 'sonner';
import { BookingStatus, BookingType, ApiError } from '@/types/api';

// Validation Schema using Zod
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  bookingType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY'] as const),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function RoomDetailContent({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const router = useRouter();
  const { roomId } = use(params);
  const { startDate: urlStartDate, endDate: urlEndDate } = use(searchParams);

  // Read list of rooms to find details of this room
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const room = rooms?.find((r) => r.id === roomId);

  // State to hold unique request UUID for idempotency
  const [activeRequestId, setActiveRequestId] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<{
    reference: string;
    status: string;
    message?: string;
  } | null>(null);

  // Date selection states (synced to input fields)
  const [inputStartDate, setInputStartDate] = useState(urlStartDate || '');
  const [inputEndDate, setInputEndDate] = useState(urlEndDate || '');

  // Booking type selection (defaults to DAILY)
  const [bookingType, setBookingType] = useState<BookingType>('DAILY');

  // React Query: Room availability
  // If dates are omitted in URL, this returns the full calendar booking list.
  // If dates are provided, it verifies date availability.
  const hasDates = !!urlStartDate && !!urlEndDate;
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailability,
    error: errorAvailability,
    refetch: refetchAvailability,
  } = useRoomAvailability(roomId, urlStartDate, urlEndDate);

  // Mutation to create a booking
  const createBookingMutation = useCreateBooking();

  // Initialize form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      bookingType: 'DAILY',
      startDate: urlStartDate || '',
      endDate: urlEndDate || '',
    },
  });

  // Sync url dates to form value
  useEffect(() => {
    if (urlStartDate) setValue('startDate', urlStartDate);
    if (urlEndDate) setValue('endDate', urlEndDate);
  }, [urlStartDate, urlEndDate, setValue]);

  // Generate UUID when component mounts or resets
  useEffect(() => {
    setActiveRequestId(uuidv4());
  }, []);

  const handleDateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStartDate || !inputEndDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(inputStartDate) > new Date(inputEndDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    // Update URL to trigger React Query refetch
    router.push(`/rooms/${roomId}?startDate=${inputStartDate}&endDate=${inputEndDate}`);
  };

  const handleClearDates = () => {
    setInputStartDate('');
    setInputEndDate('');
    router.push(`/rooms/${roomId}`);
  };

  // Main Submit Handler
  const onSubmit = async (values: BookingFormValues) => {
    setSubmissionError(null);
    setSuccessBooking(null);

    // If UUID was not set, generate it
    let reqId = activeRequestId;
    if (!reqId) {
      reqId = uuidv4();
      setActiveRequestId(reqId);
    }

    try {
      const payload = {
        ...values,
        requestId: reqId,
        roomId,
      };

      const result = await createBookingMutation.mutateAsync(payload);

      if (result.success) {
        setSuccessBooking({
          reference: result.data.bookingReference,
          status: result.data.status,
          message: result.data.message, // Present if duplicate
        });
        toast.success(result.data.message || 'Booking request submitted successfully!');
        // Reset request ID for future bookings
        setActiveRequestId(uuidv4());
      } else {
        setSubmissionError(result.message || 'Booking failed');
      }
    } catch (err: any) {
      // Parse backend standard error response envelope
      const responseData = err.response?.data as ApiError | undefined;
      if (responseData) {
        // Map backend validation errors or general messages
        if (responseData.errors && responseData.errors.length > 0) {
          const validationMsg = responseData.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(', ');
          setSubmissionError(`Validation Failed: ${validationMsg}`);
        } else {
          setSubmissionError(responseData.message || 'An unexpected error occurred.');
        }
      } else {
        setSubmissionError(err.message || 'Request timed out or network error.');
      }
      toast.error('Booking request failed.');
    }
  };

  // Retry Handler (specifically reuse the SAME UUID)
  const handleRetrySubmit = handleSubmit(onSubmit);

  if (isLoadingRooms) {
    return <div className="py-12 text-center text-slate-500">Loading room information...</div>;
  }

  if (!room) {
    return (
      <div className="py-12 text-center text-slate-500">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-4 text-xl font-bold text-slate-900">Room Not Found</h2>
        <p className="mt-2 text-slate-500">The requested room does not exist in our systems.</p>
        <Link href="/rooms" className="mt-6 inline-block">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Rooms
          </Button>
        </Link>
      </div>
    );
  }

  // Typecasting availability data based on state
  const isCheckResult = availabilityData && 'available' in availabilityData;
  const isCalendarResult = availabilityData && 'bookedRanges' in availabilityData;

  return (
    <div className="space-y-8 py-4">
      {/* Back button */}
      <div>
        <Link href="/rooms" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Conference Rooms
        </Link>
      </div>

      {/* Title block */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{room.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {room.description || 'Standard meeting room equipped for professional scheduling.'}
            </p>
          </div>
          <Badge variant="outline" className="self-start sm:self-center border-slate-300 py-1.5 px-3 bg-slate-50">
            Room UUID: {room.id}
          </Badge>
        </div>
      </div>

      {/* Date Checker Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-indigo-600" /> Check Date Availability
              </CardTitle>
              <CardDescription>
                Check if the room is available before booking. All calculations are performed by the backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDateCheck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="check-start">Start Date</Label>
                  <Input
                    id="check-start"
                    type="date"
                    value={inputStartDate}
                    onChange={(e) => setInputStartDate(e.target.value)}
                    required
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check-end">End Date</Label>
                  <Input
                    id="check-end"
                    type="date"
                    value={inputEndDate}
                    onChange={(e) => setInputEndDate(e.target.value)}
                    required
                    className="border-slate-200"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    Verify Dates
                  </Button>
                  {hasDates && (
                    <Button type="button" onClick={handleClearDates} variant="outline" className="border-slate-200">
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Calendar/Availability Panel */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-bold">Room Schedule & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingAvailability ? (
                <div className="py-6 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" /> Querying availability...
                </div>
              ) : isErrorAvailability ? (
                <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Query failed:</span>{' '}
                    {(errorAvailability as Error)?.message || 'Unable to contact server.'}
                  </div>
                </div>
              ) : isCheckResult ? (
                // DATE CHECK RESPONSE VIEW
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg flex items-start gap-3 border ${
                      availabilityData.available
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    {availabilityData.available ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm space-y-1">
                      <p className="font-bold">
                        {availabilityData.available ? 'Available' : 'Not Available'}
                      </p>
                      <p className="text-xs opacity-90">{availabilityData.message}</p>
                      {!availabilityData.available && availabilityData.nextAvailableDate && (
                        <p className="text-xs mt-2 bg-rose-100/50 p-2 rounded text-rose-950 font-medium">
                          Next available date: <Clock className="inline h-3 w-3 mr-0.5" />
                          {format(new Date(availabilityData.nextAvailableDate), 'PPP')}
                        </p>
                      )}
                    </div>
                  </div>

                  {availabilityData.conflictingBookings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Conflicting Bookings:
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {availabilityData.conflictingBookings.map((c, i) => (
                          <div key={i} className="text-xs border rounded p-2.5 bg-slate-50 border-slate-200">
                            <div className="flex justify-between font-semibold text-slate-900">
                              <span>Ref: {c.bookingReference}</span>
                              <Badge className="text-[9px] px-1 py-0.5 bg-orange-100 text-orange-800 hover:bg-orange-100">
                                {c.status}
                              </Badge>
                            </div>
                            <div className="text-slate-500 mt-1">
                              {format(new Date(c.startDate), 'MMM d')} &mdash;{' '}
                              {format(new Date(c.endDate), 'MMM d, yyyy')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : isCalendarResult ? (
                // CALENDAR/BOOKED RANGES LIST VIEW
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Booking Calendar:
                  </h4>
                  {availabilityData.bookedRanges.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No bookings scheduled for this room.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {availabilityData.bookedRanges.map((range, i) => (
                        <div key={i} className="text-xs border rounded p-2.5 bg-slate-50 border-slate-200">
                          <div className="flex justify-between font-semibold text-slate-950">
                            <span>Ref: {range.bookingReference}</span>
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1 py-0.5 ${
                                range.status === 'CONFIRMED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {range.status}
                            </Badge>
                          </div>
                          <div className="text-slate-500 mt-1">
                            {format(new Date(range.startDate), 'MMM d')} &mdash;{' '}
                            {format(new Date(range.endDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Enter dates above to fetch detailed schedule.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Request Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Create Room Booking Request
              </CardTitle>
              <CardDescription>
                Submit a booking request. The request is processed asynchronously by the NestJS queue worker and requires admin review.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {successBooking ? (
                // SUCCESS STATE
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-slate-900 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-7 w-7 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-lg text-emerald-950">Booking Request Accepted</h3>
                      <p className="text-sm text-emerald-700">HTTP 202 Accepted</p>
                    </div>
                  </div>
                  <div className="border-t border-emerald-100 pt-4 space-y-2 text-sm text-emerald-900">
                    {successBooking.message && (
                      <p className="bg-emerald-100/50 p-2.5 rounded font-medium text-emerald-950">
                        {successBooking.message}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <span className="text-emerald-700">Booking Reference:</span>
                      <span className="font-mono font-bold text-slate-900">{successBooking.reference}</span>
                      <span className="text-emerald-700">Initial Status:</span>
                      <span className="font-semibold">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                          {successBooking.status}
                        </Badge>
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button
                      onClick={() => {
                        setSuccessBooking(null);
                        setSubmissionError(null);
                      }}
                      className="bg-slate-950 hover:bg-slate-800 text-white"
                    >
                      Book Another Period
                    </Button>
                    <Link href="/bookings">
                      <Button variant="outline" className="border-slate-200">
                        Go to Booking Directory
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                // FORM INPUTS VIEW
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Submission Error Banner */}
                  {submissionError && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950 space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Submission Failed</p>
                          <p className="text-xs text-rose-600 mt-1">{submissionError}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-t border-rose-200/50 pt-2.5 text-xs text-slate-500 justify-between">
                        <span>Idempotency request ID preserved for safety.</span>
                        <Button
                          type="button"
                          onClick={handleRetrySubmit}
                          disabled={createBookingMutation.isPending}
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Retry Request
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Idempotency Key Notice */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-500 flex items-center justify-between gap-4">
                    <span>
                      Idempotency key: <code className="font-mono text-slate-900">{activeRequestId || 'generating...'}</code>
                    </span>
                    <Badge variant="outline" className="shrink-0 bg-white">
                      Idempotent
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Name */}
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" /> Customer Name
                      </Label>
                      <Input
                        id="customerName"
                        {...register('customerName')}
                        placeholder="John Doe"
                        className="border-slate-200"
                      />
                      {errors.customerName && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.customerName.message}</p>
                      )}
                    </div>

                    {/* Customer Email */}
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> Customer Email
                      </Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register('customerEmail')}
                        placeholder="john@example.com"
                        className="border-slate-200"
                      />
                      {errors.customerEmail && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Booking Type */}
                    <div className="space-y-2">
                      <Label htmlFor="bookingType">Booking Type</Label>
                      <Select
                        value={bookingType}
                        onValueChange={(val) => {
                          if (val) {
                            setBookingType(val as BookingType);
                            setValue('bookingType', val as BookingType);
                          }
                        }}
                      >
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily Booking</SelectItem>
                          <SelectItem value="WEEKLY">Weekly Booking</SelectItem>
                          <SelectItem value="MONTHLY">Monthly Booking</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.bookingType && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.bookingType.message}</p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                        className="border-slate-200"
                      />
                      {errors.startDate && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.startDate.message}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register('endDate')}
                        className="border-slate-200"
                      />
                      {errors.endDate && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createBookingMutation.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11"
                  >
                    {createBookingMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Submitting request...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Booking Request <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Initializing room viewport...</div>}>
      <RoomDetailContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
