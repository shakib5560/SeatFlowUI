'use client';

import { use, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking, useApproveBooking, useRejectBooking } from '@/hooks/useAdminBookings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, Shield, Calendar, User, Mail, Home, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import { BookingApprovalDto, ApiError } from '@/types/api';

function AdminBookingDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: bookingId } = use(params);

  // Form input states for approval/rejection bodies
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // React Query: Fetch details
  const { data: booking, isLoading, isError, error, refetch } = useBooking(bookingId);

  // Mutations
  const approveMutation = useApproveBooking();
  const rejectMutation = useApproveBooking(); // Wait, let's use useRejectBooking() hook which we defined in useAdminBookings.ts!
  const rejectMutationHook = useRejectBooking();

  const handleApprove = async () => {
    setActionError(null);
    const data: BookingApprovalDto = {};
    if (reason) data.reason = reason;
    if (notes) data.notes = notes;

    try {
      const result = await approveMutation.mutateAsync({ bookingId, data });
      if (result.success) {
        toast.success(`Booking request approved successfully! Ref: ${result.data.bookingReference}`);
        refetch();
      } else {
        setActionError(result.message || 'Approval action failed');
      }
    } catch (err: any) {
      const responseData = err.response?.data as ApiError | undefined;
      setActionError(responseData?.message || err.message || 'An unexpected error occurred during approval.');
      toast.error('Failed to approve booking.');
    }
  };

  const handleReject = async () => {
    setActionError(null);
    const data: BookingApprovalDto = {};
    if (reason) data.reason = reason;
    if (notes) data.notes = notes;

    try {
      const result = await rejectMutationHook.mutateAsync({ bookingId, data });
      if (result.success) {
        toast.warning(`Booking request rejected. Ref: ${result.data.bookingReference}`);
        refetch();
      } else {
        setActionError(result.message || 'Rejection action failed');
      }
    } catch (err: any) {
      const responseData = err.response?.data as ApiError | undefined;
      setActionError(responseData?.message || err.message || 'An unexpected error occurred during rejection.');
      toast.error('Failed to reject booking.');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
      <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" /> Loading booking detail...
    </div>;
  }

  if (isError || !booking) {
    return (
      <div className="py-12 text-center text-slate-500">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-4 text-xl font-bold text-slate-900">Booking Record Not Found</h2>
        <p className="mt-2 text-slate-500">{(error as Error)?.message || 'Record does not exist.'}</p>
        <Link href="/admin" className="mt-6 inline-block">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isPending = booking.status === 'PENDING';
  const isPendingOrMutationLoading = approveMutation.isPending || rejectMutationHook.isPending;

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link href="/admin" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      {/* Detail card */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        {/* Card Header with Status Badge */}
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Shield className="h-3.5 w-3.5" /> ID: {booking.bookingId}
              </div>
              <CardTitle className="text-xl font-extrabold text-slate-950 mt-1">
                Booking: <span className="font-mono">{booking.bookingReference}</span>
              </CardTitle>
            </div>
            <Badge
              className={`text-xs py-1 px-3 border ${
                booking.status === 'CONFIRMED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  : booking.status === 'FAILED'
                  ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-50'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Action error banner */}
          {actionError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Transaction Failed:</span> {actionError}
              </div>
            </div>
          )}

          {/* Grid details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-semibold text-slate-900">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="text-sm font-semibold text-slate-900">{booking.customerEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Booking Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Scheduling Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Home className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Conference Room</p>
                    <p className="text-sm font-semibold text-indigo-600">{booking.room?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Booking Period</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {format(new Date(booking.startDate), 'PPP')} &mdash;{' '}
                      {format(new Date(booking.endDate), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Booking Duration Type</p>
                    <Badge variant="outline" className="text-xs bg-slate-50 mt-0.5">
                      {booking.bookingType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-xs text-slate-500 font-mono">
            <div>Requested On: {format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss')}</div>
            <div className="text-right">Last Updated: {format(new Date(booking.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</div>
          </div>

          {/* Failure reason if failed */}
          {booking.status === 'FAILED' && (
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-900">
              <span className="font-bold">Failure Reason:</span>{' '}
              <code className="bg-white border border-rose-100 rounded px-1.5 py-0.5 text-xs text-rose-700 font-semibold font-mono">
                {booking.failureReason || 'ADMIN_REJECTED'}
              </code>
            </div>
          )}

          {/* Admin action panel (only visible if status is PENDING) */}
          {isPending && (
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-md">Process Booking Request</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="review-reason">Reason (for email logs)</Label>
                  <Input
                    id="review-reason"
                    placeholder="e.g. Booking period verified..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isPendingOrMutationLoading}
                    className="border-slate-200 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-notes">Internal Notes</Label>
                  <Input
                    id="review-notes"
                    placeholder="e.g. VIP team reservation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isPendingOrMutationLoading}
                    className="border-slate-200 font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button
                  onClick={handleApprove}
                  disabled={isPendingOrMutationLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 h-11"
                >
                  <Check className="h-5 w-5" /> Approve Request
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isPendingOrMutationLoading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-1.5 h-11"
                >
                  <X className="h-5 w-5" /> Reject Request
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Initializing review deck...</div>}>
      <AdminBookingDetailContent params={params} />
    </Suspense>
  );
}
