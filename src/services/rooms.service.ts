import api from '@/lib/api';
import {
  StandardApiResponse,
  RoomDto,
  RoomAvailabilityDto,
  RoomAvailabilityCheckDto,
  EventResponseDto,
} from '@/types/api';

export const RoomsService = {
  getRooms: async (): Promise<StandardApiResponse<RoomDto[]>> => {
    const response = await api.get<StandardApiResponse<RoomDto[]>>('/rooms');
    return response.data;
  },

  getAvailability: async (
    roomId: string,
    startDate?: string,
    endDate?: string
  ): Promise<StandardApiResponse<RoomAvailabilityDto | RoomAvailabilityCheckDto>> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<
      StandardApiResponse<RoomAvailabilityDto | RoomAvailabilityCheckDto>
    >(`/rooms/${roomId}/availability`, { params });
    return response.data;
  },

  getEvents: async (): Promise<StandardApiResponse<EventResponseDto[]>> => {
    const response = await api.get<StandardApiResponse<EventResponseDto[]>>('/events');
    return response.data;
  },
};
