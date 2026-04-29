import { QueryClient } from '@tanstack/react-query';
import { isApiError } from './errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, err) => {
        if (isApiError(err)) {
          if (err.status >= 400 && err.status < 500 && err.status !== 408) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      gcTime: 10 * 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});
