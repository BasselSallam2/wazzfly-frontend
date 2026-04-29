import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, AppSettings, ListQuery, Paginated, PaymentMethod } from '@/types';

export const settingsApi = {
  list: async (query?: ListQuery): Promise<Paginated<AppSettings>> => {
    const res = await api.get<Paginated<AppSettings>>(E.setting.base, {
      params: buildQuery(query),
    });
    return res.data;
  },
  current: async (): Promise<AppSettings | null> => {
    const res = await api.get<Paginated<AppSettings>>(E.setting.base, {
      params: buildQuery({ limit: 1 }),
    });
    return res.data.data?.[0] ?? null;
  },
  update: async (id: string, payload: Partial<AppSettings>): Promise<AppSettings> => {
    const res = await api.put<ApiEnvelope<AppSettings>>(E.setting.byId(id), payload);
    return res.data.data;
  },
  clearCache: async (): Promise<void> => {
    await api.get(E.cache.clear);
  },
  clearLogs: async (): Promise<void> => {
    await api.get(E.logs.clear);
  },
  paymentMethods: {
    list: async (): Promise<Paginated<PaymentMethod>> => {
      const res = await api.get<Paginated<PaymentMethod>>(E.paymentMethod.base);
      return res.data;
    },
    create: async (payload: Partial<PaymentMethod>): Promise<PaymentMethod> => {
      const res = await api.post<ApiEnvelope<PaymentMethod>>(E.paymentMethod.base, payload);
      return res.data.data;
    },
    update: async (id: string, payload: Partial<PaymentMethod>): Promise<PaymentMethod> => {
      const res = await api.put<ApiEnvelope<PaymentMethod>>(E.paymentMethod.byId(id), payload);
      return res.data.data;
    },
    remove: async (id: string): Promise<void> => {
      await api.delete(E.paymentMethod.byId(id));
    },
  },
};
