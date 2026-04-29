import { api } from '@lib/api/client';
import { E } from '@lib/api/endpoints';
import type { ApiEnvelope, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await api.post<ApiEnvelope<LoginResponse>>(E.auth.login, payload);
    return res.data.data;
  },
  logout: async (): Promise<void> => {
    try {
      await api.post(E.auth.logout);
    } catch {
      /* ignore network errors on logout */
    }
  },
  me: async (): Promise<User> => {
    const res = await api.get<ApiEnvelope<User>>(E.admin.me);
    return res.data.data;
  },
  resetPassword: async (payload: { oldPassword: string; newPassword: string }): Promise<void> => {
    await api.post(E.auth.resetPassword, payload);
  },
};
