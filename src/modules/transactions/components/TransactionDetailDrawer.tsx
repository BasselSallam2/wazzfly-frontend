import { useQuery } from '@tanstack/react-query';
import { Drawer } from '@components/ui/Drawer';
import { LoadingState } from '@components/feedback/LoadingState';
import { ErrorState } from '@components/feedback/ErrorState';
import { Badge } from '@components/ui/Badge';
import { transactionsApi } from '../api/transactions.api';
import { transactionTypeMap, transactionStatusMap } from '@components/data-table/statusMaps';
import { QUERY_KEYS } from '@/config/constants';
import { formatCurrency } from '@lib/format/currency';
import { formatDateTime } from '@lib/format/date';
import type { User } from '@/types';

interface Props {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function asUser(v: string | User | null | undefined): User | null {
  return typeof v === 'object' && v ? v : null;
}

export function TransactionDetailDrawer({ id, open, onOpenChange }: Props) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.transactions.detail, id],
    queryFn: () => transactionsApi.get(id!),
    enabled: open && Boolean(id),
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Transaction details" width="md">
      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : query.data ? (
        <div className="space-y-5">
          <div>
            <p className="text-label-sm uppercase text-on-surface-variant">Amount</p>
            <p className="text-display tabular text-on-surface">{formatCurrency(query.data.amount)}</p>
            <div className="mt-2 flex gap-2">
              <Badge tone={transactionTypeMap[query.data.type]?.tone ?? 'neutral'}>
                {transactionTypeMap[query.data.type]?.label ?? query.data.type}
              </Badge>
              <Badge tone={transactionStatusMap[query.data.status ?? 'completed']?.tone ?? 'neutral'} dot>
                {transactionStatusMap[query.data.status ?? 'completed']?.label ?? query.data.status}
              </Badge>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-body-md">
            <div>
              <dt className="text-label-sm uppercase text-on-surface-variant">From</dt>
              <dd className="mt-1 text-on-surface">
                {asUser(query.data.from)?.name ?? 'System wallet'}
              </dd>
            </div>
            <div>
              <dt className="text-label-sm uppercase text-on-surface-variant">To</dt>
              <dd className="mt-1 text-on-surface">
                {asUser(query.data.to)?.name ?? 'System wallet'}
              </dd>
            </div>
            <div>
              <dt className="text-label-sm uppercase text-on-surface-variant">Created</dt>
              <dd className="mt-1 text-on-surface">{formatDateTime(query.data.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-label-sm uppercase text-on-surface-variant">ID</dt>
              <dd className="mt-1 font-mono text-body-sm text-on-surface">{query.data._id}</dd>
            </div>
          </dl>

          {query.data.meta ? (
            <div className="rounded-md border border-outline-variant p-3">
              <p className="text-label-sm uppercase text-on-surface-variant">Meta</p>
              <pre className="mt-2 overflow-x-auto text-body-sm font-mono text-on-surface">
                {JSON.stringify(query.data.meta, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </Drawer>
  );
}
