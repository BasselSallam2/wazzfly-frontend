import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';
import { Select } from '@components/ui/Select';
import { TransactionsTable } from '@modules/transactions/components/TransactionsTable';
import { transactionsApi, type TransactionFilters } from '@modules/transactions/api/transactions.api';
import { QUERY_KEYS, TRANSACTION_TYPE } from '@/config/constants';
import type { ListQuery } from '@/types';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  ...TRANSACTION_TYPE.map((t) => ({ value: t, label: t })),
];

export function TransactionExplorer() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');

  const filters: TransactionFilters = useMemo(() => {
    const f: TransactionFilters = {};
    if (type !== 'all') f.type = type;
    return f;
  }, [type]);

  const query: ListQuery<TransactionFilters> = useMemo(
    () => ({
      limit: 10,
      page,
      sort: '-createdAt',
      filters,
      populate: [
        { path: 'from', select: 'name email avatar' },
        { path: 'to', select: 'name email avatar' },
      ],
    }),
    [page, filters],
  );

  const txQuery = useQuery({
    queryKey: [QUERY_KEYS.transactions.list, 'explorer', query],
    queryFn: () => transactionsApi.list(query),
    placeholderData: (prev) => prev,
  });

  const total = txQuery.data?.pagination?.total ?? 0;
  const pages = txQuery.data?.pagination?.pages ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-end">
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v);
              setPage(1);
            }}
            options={TYPE_OPTIONS}
            className="w-48"
          />
        </div>
        <TransactionsTable
          data={txQuery.data?.data}
          isLoading={txQuery.isLoading}
          isError={txQuery.isError}
          error={txQuery.error}
          onRetry={() => txQuery.refetch()}
        />
        <Pagination
          page={page}
          pageCount={pages}
          total={total}
          pageSize={query.limit}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}
