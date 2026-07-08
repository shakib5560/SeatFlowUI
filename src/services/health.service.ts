import api from '@/lib/api';
import { HealthResponseDto } from '@/types/api';

export const HealthService = {
  getHealth: async (): Promise<HealthResponseDto> => {
    const response = await api.get<HealthResponseDto>('/health');
    return response.data;
  },

  checkReady: async (): Promise<string> => {
    const response = await api.get<string>('/health/ready', { responseType: 'text' });
    return response.data;
  },

  checkLive: async (): Promise<string> => {
    const response = await api.get<string>('/health/live', { responseType: 'text' });
    return response.data;
  },
};
