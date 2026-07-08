import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { BookingQueryDto, BookingApprovalDto } from '@/types/api';
import { BOOKINGS_QUERY_KEY } from './useBookings';
import { ROOMS_QUERY_KEY } from './useRooms';

export const ADMIN_BOOKINGS_QUERY_KEY = ['admin', 'bookings'] as const;

export function useAdminBookings(filters: BookingQueryDto) {
  return useQuery({
    queryKey: [...ADMIN_BOOKINGS_QUERY_KEY, 'all', filters],
    queryFn: async () => {
      const response = await AdminService.getBookings(filters);
      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 15,
  });
}

export function usePendingBookings(filters: BookingQueryDto = {}) {
  return useQuery({
    queryKey: [...ADMIN_BOOKINGS_QUERY_KEY, 'pending', filters],
    queryFn: async () => {
      const response = await AdminService.getPendingBookings(filters);
      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 15,
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: [...ADMIN_BOOKINGS_QUERY_KEY, 'detail', bookingId],
    queryFn: async () => {
      const response = await AdminService.getBookingDetails(bookingId);
      return response.data;
    },
    enabled: !!bookingId,
    retry: 1,
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: BookingApprovalDto;
    }) => {
      const response = await AdminService.approveBooking(bookingId, data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: ADMIN_BOOKINGS_QUERY_KEY });
      // Invalidate public queries
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      // Invalidate room list & availability calendars
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: BookingApprovalDto;
    }) => {
      const response = await AdminService.rejectBooking(bookingId, data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: ADMIN_BOOKINGS_QUERY_KEY });
      // Invalidate public queries
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      // Invalidate room list & availability calendars
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}
