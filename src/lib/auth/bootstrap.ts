import { useAuthStore } from '@store/authStore';
import { tokenStorage } from './tokenStorage';
import { authApi } from '@modules/auth/api/auth.api';
import { connectSocket } from '@lib/api/socket';
import { mergeUserTypeFromToken } from '@lib/auth/mergeUserType';

export async function bootstrapAuth(): Promise<void> {
  const store = useAuthStore.getState();
  const token = tokenStorage.read();

  if (!token) {
    store.setHydrated(true);
    return;
  }

  try {
    const rawUser = await authApi.me();
    const user = mergeUserTypeFromToken(rawUser, token);
    if (user.type !== 'admin') {
      tokenStorage.clear();
      store.clear();
    } else {
      store.setSession({ token, user });
      try {
        connectSocket();
      } catch {
        // Socket is best-effort; REST still drives the app.
      }
    }
  } catch {
    tokenStorage.clear();
    store.clear();
  } finally {
    useAuthStore.getState().setHydrated(true);
  }
}
