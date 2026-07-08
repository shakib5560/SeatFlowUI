import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingsService } from '@/services/bookings.service';
import { BookingQueryDto, CreateBookingDto } from '@/types/api';
import { ROOMS_QUERY_KEY } from './useRooms';

export const BOOKINGS_QUERY_KEY = ['bookings', 'list'] as const;

export function useBookings(filters: BookingQueryDto) {
  return useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await BookingsService.getBookings(filters);
      return response.data;
    },
    retry: 1,
    staleTime: 1000 * 15, // 15 seconds cache
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingDto) => {
      const response = await BookingsService.createBooking(data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate the public booking list
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      // Invalidate availability calendars
      queryClient.invalidateQueries({
        queryKey: ['rooms', variables.roomId, 'availability'],
      });
      // Invalidate general rooms
      queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY });
    },
  });
}
