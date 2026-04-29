import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@lib/api/socket';
import { QUERY_KEYS } from '@/config/constants';

type ChatMessagePayload = { chatId?: string; message?: unknown };

/**
 * Listens for server `chat:message` (matches backend) and joins/leaves
 * the Socket.IO room for `activeChatId` so HTTP-saved messages are received.
 */
export function useChatSocket(activeChatId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    const onMessage = (payload: ChatMessagePayload) => {
      const cid = payload?.chatId;
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chat.list] });
      if (cid) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.chat.detail, cid] });
      }
    };

    socket.on('chat:message', onMessage);
    return () => {
      socket.off('chat:message', onMessage);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!activeChatId) return;
    const socket = getSocket();
    socket.emit('chat:join', { chatId: activeChatId });
    return () => {
      socket.emit('chat:leave', { chatId: activeChatId });
    };
  }, [activeChatId]);
}
