import { create } from 'zustand';
import type { User } from '@/types';
import { mergeUserTypeFromToken } from '@lib/auth/mergeUserType';

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setSession: (payload: { token: string; user: User }) => void;
  setUser: (user: User | null) => void;
  setHydrated: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  setSession: ({ token, user }) => set({ token, user: mergeUserTypeFromToken(user, token) }),
  setUser: (user) =>
    set((state) => ({
      user: user ? mergeUserTypeFromToken(user, state.token) : null,
    })),
  setHydrated: (value) => set({ isHydrated: value }),
  clear: () => set({ token: null, user: null }),
}));

export const selectIsAdmin = (state: AuthState) => state.user?.type === 'admin';
export const selectIsAuthenticated = (state: AuthState) =>
  Boolean(state.token) && Boolean(state.user);
