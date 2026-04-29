import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { ErrorState } from '@components/feedback/ErrorState';
import { EmptyState } from '@components/feedback/EmptyState';
import { Badge } from '@components/ui/Badge';
import { transactionsApi } from '@modules/transactions/api/transactions.api';
import { QUERY_KEYS } from '@/config/constants';
import { formatCurrency } from '@lib/format/currency';
import { formatRelative } from '@lib/format/date';
import { transactionTypeMap } from '@components/data-table/statusMaps';
import { Avatar } from '@components/ui/Avatar';

export function RecentTransactionsCard() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.transactions.list, 'recent'],
    queryFn: () =>
      transactionsApi.list({
        sort: '-createdAt',
        limit: 8,
        populate: [
          { path: 'from', select: 'name email avatar' },
          { path: 'to', select: 'name email avatar' },
        ],
      }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {query.isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 rounded-md border border-outline-variant p-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : (query.data?.data ?? []).length === 0 ? (
          <EmptyState icon="receipt_long" title="No transactions yet" />
        ) : (
          (query.data?.data ?? []).map((tx) => {
            const counterparty =
              tx.type === 'Withdrawal' || tx.type === 'refund'
                ? typeof tx.to === 'object' && tx.to
                  ? tx.to
                  : null
                : typeof tx.from === 'object' && tx.from
                  ? tx.from
                  : typeof tx.to === 'object' && tx.to
                    ? tx.to
                    : null;

            const typeMeta = transactionTypeMap[tx.type] ?? { label: tx.type, tone: 'neutral' as const };

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between gap-3 rounded-md border border-outline-variant p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={counterparty?.name ?? 'System'} src={counterparty?.avatar} size="sm" />
                  <div>
                    <p className="text-body-md font-medium text-on-surface">
                      {counterparty?.name ?? 'System wallet'}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {formatRelative(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={typeMeta.tone}>{typeMeta.label}</Badge>
                  <span className="tabular text-label-md font-semibold text-on-surface">
                    {formatCurrency(tx.amount)}
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
