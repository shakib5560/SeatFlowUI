import api from '@/lib/api';
import {
  StandardApiResponse,
  PaginatedAdminBookingsDto,
  AdminBookingDetailDto,
  BookingApprovalDto,
  AdminActionResultDto,
  BookingQueryDto,
} from '@/types/api';

export const AdminService = {
  getBookings: async (
    filters: BookingQueryDto
  ): Promise<StandardApiResponse<PaginatedAdminBookingsDto>> => {
    const response = await api.get<StandardApiResponse<PaginatedAdminBookingsDto>>(
      '/admin/bookings',
      { params: filters }
    );
    return response.data;
  },

  getPendingBookings: async (
    filters: BookingQueryDto
  ): Promise<StandardApiResponse<PaginatedAdminBookingsDto>> => {
    const response = await api.get<StandardApiResponse<PaginatedAdminBookingsDto>>(
      '/admin/bookings/pending',
      { params: filters }
    );
    return response.data;
  },

  getBookingDetails: async (
    bookingId: string
  ): Promise<StandardApiResponse<AdminBookingDetailDto>> => {
    const response = await api.get<StandardApiResponse<AdminBookingDetailDto>>(
      `/admin/bookings/${bookingId}`
    );
    return response.data;
  },

  approveBooking: async (
    bookingId: string,
    data: BookingApprovalDto
  ): Promise<StandardApiResponse<AdminActionResultDto>> => {
    const response = await api.patch<StandardApiResponse<AdminActionResultDto>>(
      `/admin/bookings/${bookingId}/approve`,
      data
    );
    return response.data;
  },

  rejectBooking: async (
    bookingId: string,
    data: BookingApprovalDto
  ): Promise<StandardApiResponse<AdminActionResultDto>> => {
    const response = await api.patch<StandardApiResponse<AdminActionResultDto>>(
      `/admin/bookings/${bookingId}/reject`,
      data
    );
    return response.data;
  },
};
