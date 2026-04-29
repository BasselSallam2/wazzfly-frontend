import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { DataTableToolbar } from '@components/data-table/DataTableToolbar';
import { TransactionsTable } from '../components/TransactionsTable';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';
import { transactionsApi, type TransactionFilters } from '../api/transactions.api';
import { QUERY_KEYS, ROUTES, TRANSACTION_TYPE } from '@/config/constants';
import type { ListQuery } from '@/types';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  ...TRANSACTION_TYPE.map((t) => ({ value: t, label: t })),
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: '-amount', label: 'Amount high → low' },
  { value: 'amount', label: 'Amount low → high' },
];

export function TransactionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sort, setSort] = useState('-createdAt');

  const filters: TransactionFilters = useMemo(() => {
    const f: TransactionFilters = {};
    if (type !== 'all') f.type = type;
    if (from) f['createdAt[gte]'] = from;
    if (to) f['createdAt[lte]'] = to;
    if (minAmount) f['amount[gte]'] = Number(minAmount);
    if (maxAmount) f['amount[lte]'] = Number(maxAmount);
    return f;
  }, [type, from, to, minAmount, maxAmount]);

  const query: ListQuery<TransactionFilters> = useMemo(
    () => ({
      limit: 20,
      page,
      sort,
      filters,
      populate: [
        { path: 'from', select: 'name email avatar' },
        { path: 'to', select: 'name email avatar' },
      ],
    }),
    [page, sort, filters],
  );

  const txQuery = useQuery({
    queryKey: [QUERY_KEYS.transactions.list, query],
    queryFn: () => transactionsApi.list(query),
    placeholderData: (prev) => prev,
  });

  const total = txQuery.data?.pagination?.total ?? 0;
  const pages = txQuery.data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Transactions"
        description="Audit every charge, transfer, withdrawal, refund and credit. Filter by date range and amount."
      />
      <DataTableToolbar
        filters={
          <>
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v);
                setPage(1);
              }}
              options={TYPE_OPTIONS}
              className="w-40"
            />
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              iconLeft="event"
              className="w-44"
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              iconLeft="event"
              className="w-44"
            />
            <Input
              type="number"
              placeholder="Min $"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-28"
            />
            <Input
              type="number"
              placeholder="Max $"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-28"
            />
            <Select value={sort} onValueChange={setSort} options={SORT_OPTIONS} className="w-48" />
          </>
        }
      />
      <TransactionsTable
        data={txQuery.data?.data}
        isLoading={txQuery.isLoading}
        isError={txQuery.isError}
        error={txQuery.error}
        onRetry={() => txQuery.refetch()}
        onRowClick={(row) => navigate(ROUTES.transactionDetails(row._id))}
      />
      <Card className="px-4 py-3">
        <Pagination
          page={page}
          pageCount={pages}
          total={total}
          pageSize={query.limit}
          onPageChange={setPage}
        />
      </Card>
      <TransactionDetailDrawer
        id={id ?? null}
        open={Boolean(id)}
        onOpenChange={(open) => {
          if (!open) navigate(ROUTES.transactions);
        }}
      />
    </div>
  );
}
