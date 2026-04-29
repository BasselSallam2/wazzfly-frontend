import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@lib/api/socket';
import { QUERY_KEYS } from '@/config/constants';

export function useNotificationsSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.unread] });
    };

    socket.on('notification:new', invalidate);
    socket.on('notification:update', invalidate);

    return () => {
      socket.off('notification:new', invalidate);
      socket.off('notification:update', invalidate);
    };
  }, [queryClient]);
}
