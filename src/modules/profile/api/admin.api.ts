import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import type { ApiEnvelope, User } from '@/types';

export const adminApi = {
  me: async (): Promise<User> => {
    const res = await api.get<ApiEnvelope<User>>(E.admin.me);
    return res.data.data;
  },
  updateMe: async (payload: Partial<User>): Promise<User> => {
    const res = await api.put<ApiEnvelope<User>>(E.admin.me, payload);
    return res.data.data;
  },
};
