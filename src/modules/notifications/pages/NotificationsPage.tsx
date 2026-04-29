import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Icon } from '@components/ui/Icon';
import { LoadingState } from '@components/feedback/LoadingState';
import { ErrorState } from '@components/feedback/ErrorState';
import { EmptyState } from '@components/feedback/EmptyState';
import { notificationsApi } from '../api/notifications.api';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import { formatRelative } from '@lib/format/date';
import { toast } from '@components/ui/Toast';
import type { NotificationItem } from '@/types';

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

export function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.notifications.list],
    queryFn: () => notificationsApi.list({ sort: '-createdAt', limit: 50 }),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      toast.success('Marked all notifications as read');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: () => {
      toast.success('Notification deleted');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications.list] });
    },
  });

  const handleClick = (n: NotificationItem) => {
    if (!n.isRead) markRead.mutate(n._id);
    const link = notificationLink(n);
    if (link) navigate(link);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Notifications"
        description="System events, ticket updates, refunds, and chat pings."
        actions={
          <Button
            variant="secondary"
            onClick={() => markAll.mutate()}
            loading={markAll.isPending}
            iconLeft="done_all"
          >
            Mark all read
          </Button>
        }
      />
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : (query.data?.data ?? []).length === 0 ? (
        <Card className="p-8">
          <EmptyState icon="notifications" title="You’re all caught up." />
        </Card>
      ) : (
        <Card>
          <ul>
            {(query.data?.data ?? []).map((n) => (
              <li
                key={n._id}
                className="flex items-start gap-3 border-b border-outline-variant p-4 transition-colors hover:bg-surface-container-low last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => handleClick(n)}
                  className="flex flex-1 items-start gap-3 text-left"
                >
                  <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                    <Icon name="notifications" size={18} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-label-md font-medium text-on-surface">{n.title}</p>
                      {!n.isRead ? <Badge tone="info">New</Badge> : null}
                    </div>
                    {n.body ? (
                      <p className="text-body-md text-on-surface-variant">{n.body}</p>
                    ) : null}
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete notification"
                  onClick={() => remove.mutate(n._id)}
                >
                  <Icon name="delete" size={18} />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
