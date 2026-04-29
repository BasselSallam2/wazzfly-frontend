import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@components/data-table/DataTable';
import {
  AvatarNameCell,
  CurrencyCell,
  DateCell,
  IdCell,
  StatusBadgeCell,
} from '@components/data-table/columnHelpers';
import { transactionStatusMap, transactionTypeMap } from '@components/data-table/statusMaps';
import type { Transaction, User } from '@/types';

interface Props {
  data: Transaction[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onRowClick?: (row: Transaction) => void;
}

function asUser(v: string | User | null | undefined): User | null {
  return typeof v === 'object' && v ? v : null;
}

export function TransactionsTable({
  data,
  isLoading,
  isError,
  error,
  onRetry,
  onRowClick,
}: Props) {
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        cell: ({ row }) => <IdCell value={row.original._id} />,
      },
      {
        id: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const meta = transactionTypeMap[row.original.type] ?? {
            label: row.original.type,
            tone: 'neutral' as const,
          };
          return <StatusBadgeCell label={meta.label} tone={meta.tone} />;
        },
      },
      {
        id: 'from',
        header: 'From',
        cell: ({ row }) => {
          const u = asUser(row.original.from);
          if (!u) return <span className="text-on-surface-variant">System</span>;
          return <AvatarNameCell name={u.name} email={u.email} src={u.avatar} />;
        },
      },
      {
        id: 'to',
        header: 'To',
        cell: ({ row }) => {
          const u = asUser(row.original.to);
          if (!u) return <span className="text-on-surface-variant">System</span>;
          return <AvatarNameCell name={u.name} email={u.email} src={u.avatar} />;
        },
      },
      {
        id: 'amount',
        header: 'Amount',
        cell: ({ row }) => <CurrencyCell amount={row.original.amount} />,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status ?? 'completed';
          const meta = transactionStatusMap[status] ?? {
            label: status,
            tone: 'neutral' as const,
          };
          return <StatusBadgeCell label={meta.label} tone={meta.tone} />;
        },
      },
      {
        id: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <DateCell value={row.original.createdAt} />,
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={onRetry}
      onRowClick={onRowClick}
      rowKey={(row) => row._id}
      emptyTitle="No transactions"
    />
  );
}
