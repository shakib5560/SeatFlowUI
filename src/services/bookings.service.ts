import api from '@/lib/api';
import {
  StandardApiResponse,
  CreateBookingDto,
  BookingResponseDto,
  BookingQueryDto,
  PaginatedBookingsDto,
} from '@/types/api';

export const BookingsService = {
  createBooking: async (
    data: CreateBookingDto
  ): Promise<StandardApiResponse<BookingResponseDto>> => {
    // Generate UUID or reuse standard one. Make sure it's passed as a header
    const headers: Record<string, string> = {};
    if (data.requestId) {
      headers['x-request-id'] = data.requestId;
    }

    const response = await api.post<StandardApiResponse<BookingResponseDto>>(
      '/bookings',
      data,
      { headers }
    );
    return response.data;
  },

  getBookings: async (
    filters: BookingQueryDto
  ): Promise<StandardApiResponse<PaginatedBookingsDto>> => {
    const response = await api.get<StandardApiResponse<PaginatedBookingsDto>>(
      '/bookings',
      { params: filters }
    );
    return response.data;
  },
};
