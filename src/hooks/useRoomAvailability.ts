import { useQuery } from '@tanstack/react-query';
import { RoomsService } from '@/services/rooms.service';

export const getAvailabilityQueryKey = (
  roomId: string,
  startDate?: string,
  endDate?: string
) => ['rooms', roomId, 'availability', { startDate, endDate }] as const;

export function useRoomAvailability(
  roomId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: getAvailabilityQueryKey(roomId, startDate, endDate),
    queryFn: async () => {
      const response = await RoomsService.getAvailability(roomId, startDate, endDate);
      return response.data;
    },
    enabled: !!roomId,
    retry: 1,
    staleTime: 1000 * 30, // 30 seconds cache
  });
}
