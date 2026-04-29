import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import { buildQuery } from '@lib/api/apiFeatures';
import type { ApiEnvelope, ListQuery, Paginated, User } from '@/types';

export interface UserFilters {
  type?: 'admin' | 'client' | 'freelancer';
  deleted?: boolean;
  isVerified?: boolean;
}

export const usersApi = {
  list: async (query?: ListQuery<UserFilters>): Promise<Paginated<User>> => {
    const res = await api.get<Paginated<User>>(E.user.base, { params: buildQuery(query) });
    return res.data;
  },
  get: async (id: string, query?: ListQuery): Promise<User> => {
    const res = await api.get<ApiEnvelope<User>>(E.user.byId(id), { params: buildQuery(query) });
    return res.data.data;
  },
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const res = await api.put<ApiEnvelope<User>>(E.user.byId(id), payload);
    return res.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(E.user.byId(id));
  },
};
