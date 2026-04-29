import { useAuthStore } from '@/store/authStore';

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}

export function useIsAdmin() {
  return useAuthStore((s) => s.user?.type === 'admin');
}
