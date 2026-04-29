import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { normalizeAxiosError } from './errors';

export const AUTH_LOGOUT_EVENT = 'auth:logout';

export const api: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.read();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const apiError = normalizeAxiosError(err);
    if (apiError.status === 401) {
      tokenStorage.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
      }
    }
    return Promise.reject(apiError);
  },
);
