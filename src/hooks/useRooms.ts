import { useQuery } from '@tanstack/react-query';
import { RoomsService } from '@/services/rooms.service';

export const ROOMS_QUERY_KEY = ['rooms', 'list'] as const;
export const EVENTS_QUERY_KEY = ['events', 'list'] as const;

export function useRooms() {
  return useQuery({
    queryKey: ROOMS_QUERY_KEY,
    queryFn: async () => {
      const response = await RoomsService.getRooms();
      return response.data;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useLegacyEvents() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await RoomsService.getEvents();
      return response.data;
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
}
