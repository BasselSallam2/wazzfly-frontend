import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import type { ApiEnvelope, DashboardMetrics } from '@/types';
import { type DashboardMetricsApi, normalizeDashboardMetrics } from './normalizeDashboardMetrics';

export const dashboardApi = {
  metrics: async (): Promise<DashboardMetrics> => {
    const res = await api.post<ApiEnvelope<DashboardMetricsApi>>(E.setting.dashboardMetrics, {});
    return normalizeDashboardMetrics(res.data.data);
  },
};
