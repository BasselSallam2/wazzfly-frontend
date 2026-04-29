import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { Button } from '@components/ui/Button';
import { Icon } from '@components/ui/Icon';
import { Skeleton } from '@components/ui/Skeleton';
import { notificationsApi } from '../api/notifications.api';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import { formatRelative } from '@lib/format/date';
import { useNotificationsSocket } from '@lib/socket/useNotificationsSocket';
import type { NotificationItem } from '@/types';
import { env } from '@/config/env';

/** Backend may return `data` without `pagination`; avoid `a?.b.c` (throws when `b` is undefined). */
function getUnreadCount(
  payload: { data?: NotificationItem[]; pagination?: { total?: number } } | undefined,
): number {
  const total = payload?.pagination?.total;
  if (typeof total === 'number') return total;
  return (payload?.data ?? []).filter((n) => !n.isRead).length;
}

function notificationLink(n: NotificationItem): string | null {
  if (!n.linkRef || !n.linkId) return null;
  switch (n.linkRef) {
    case 'project':
      return ROUTES.projectDetails(n.linkId);
    case 'ticket':
      return ROUTES.ticketDetails(n.linkId);
    case 'chat':
      return ROUTES.chatThread(n.linkId);
    case 'transaction':
      return ROUTES.transactionDetails(n.linkId);
    case 'user':
      return ROUTES.userDetails(n.linkId);
    default:
      return null;
  }
}

export function NotificationsBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useNotificationsSocket();

  const unread = useQuery({
    queryKey: [QUERY_KEYS.notifications.unread],
    queryFn: () =>
      notificationsApi.list({
        limit: 1,
        filters: { isRead: false },
      }),
    refetchInterval: env.VITE_NOTIFICATIONS_POLL_MS,
  });

  const recent = useQuery({
    queryKey: [QUERY_KEYS.notifications.list, 'dropdown'],
    queryFn: () =>
      notificationsApi.list({
        limit: 10,
        sort: '-createdAt',
      }),
    refetchInterval: env.VITE_NOTIFICATIONS_POLL_MS,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.unread] });
    },
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.unread] });
    },
  });

  const unreadCount = getUnreadCount(unread.data);
  const items = recent.data?.data ?? [];

  const handleClick = (n: NotificationItem) => {
    if (!n.isRead) markRead.mutate(n._id);
    const link = notificationLink(n);
    if (link) navigate(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Icon name="notifications" size={20} />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1 text-label-sm font-semibold text-on-error">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="px-1 py-0">Notifications</DropdownMenuLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
          {recent.isLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-center text-body-md text-on-surface-variant">
              No notifications yet.
            </p>
          ) : (
            <ul>
              {items.map((n) => (
                <li
                  key={n._id}
                  className={`flex cursor-pointer items-start gap-3 border-b border-outline-variant px-3 py-3 transition-colors hover:bg-surface-container-low last:border-b-0 ${
                    !n.isRead ? 'bg-primary-container/30' : ''
                  }`}
                  onClick={() => handleClick(n)}
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                    <Icon name="notifications" size={16} />
                  </span>
                  <div className="flex-1">
                    <p className="text-label-md font-medium text-on-surface">{n.title}</p>
                    {n.body ? (
                      <p className="line-clamp-2 text-body-sm text-on-surface-variant">{n.body}</p>
                    ) : null}
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => navigate(ROUTES.notifications)}
          >
            View all
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
