import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { tokenStorage } from '@/lib/auth/tokenStorage';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.VITE_SOCKET_URL, {
      path: env.VITE_SOCKET_PATH,
      auth: { token: tokenStorage.read() ?? '' },
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: tokenStorage.read() ?? '' };
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
