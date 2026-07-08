import { useQuery } from '@tanstack/react-query';
import { HealthService } from '@/services/health.service';

export function useHealth() {
  return useQuery({
    queryKey: ['health', 'details'],
    queryFn: () => HealthService.getHealth(),
    refetchInterval: 10000, // Poll every 10 seconds
    retry: 1,
  });
}

export function useReady() {
  return useQuery({
    queryKey: ['health', 'ready'],
    queryFn: () => HealthService.checkReady(),
    refetchInterval: 10000, // Poll every 10 seconds
    retry: 1,
  });
}

export function useLive() {
  return useQuery({
    queryKey: ['health', 'live'],
    queryFn: () => HealthService.checkLive(),
    refetchInterval: 10000, // Poll every 10 seconds
    retry: 1,
  });
}
