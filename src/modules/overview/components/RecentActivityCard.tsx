import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { Icon } from '@components/ui/Icon';
import { ErrorState } from '@components/feedback/ErrorState';
import { EmptyState } from '@components/feedback/EmptyState';
import { activityApi, ACTIVITY_USER_POPULATE } from '@modules/activity/api/activity.api';
import { QUERY_KEYS } from '@/config/constants';
import { formatRelative } from '@lib/format/date';

export function RecentActivityCard() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.activity.recent],
    queryFn: () =>
      activityApi.list({
        sort: '-createdAt',
        limit: 8,
        populate: ACTIVITY_USER_POPULATE,
      }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {query.isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : (query.data?.data ?? []).length === 0 ? (
          <EmptyState icon="history" title="No recent activity" />
        ) : (
          (query.data?.data ?? []).map((item) => {
            const userName = (() => {
              const a = item.actor ?? item.user;
              if (typeof a === 'object' && a && 'name' in a) return a.name;
              return 'System';
            })();
            return (
              <div
                key={item._id}
                className="flex items-start gap-3 rounded-md border border-outline-variant p-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon name="bolt" size={16} />
                </span>
                <div className="flex flex-1 flex-col">
                  <p className="text-body-md text-on-surface">
                    <span className="font-semibold">{userName}</span>{' '}
                    <span className="text-on-surface-variant">{item.action}</span>
                  </p>
                  <span className="text-body-sm text-on-surface-variant">
                    {formatRelative(item.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
