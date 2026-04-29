import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@components/data-table/DataTable';
import {
  AvatarNameCell,
  CurrencyCell,
  DateCell,
  StatusBadgeCell,
} from '@components/data-table/columnHelpers';
import { userTypeMap, userStatusMap } from '@components/data-table/statusMaps';
import type { User } from '@/types';

export interface UsersTableProps {
  data: User[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRowClick?: (row: User) => void;
  onRetry?: () => void;
}

export function UsersTable({ data, isLoading, isError, error, onRowClick, onRetry }: UsersTableProps) {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'user',
        header: 'User',
        cell: ({ row }) => (
          <AvatarNameCell name={row.original.name} email={row.original.email} src={row.original.avatar} />
        ),
      },
      {
        id: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.type;
          const meta = userTypeMap[type] ?? { label: type, tone: 'neutral' as const };
          return <StatusBadgeCell label={meta.label} tone={meta.tone} />;
        },
      },
      {
        id: 'wallet',
        header: 'Wallet',
        cell: ({ row }) => <CurrencyCell amount={row.original.wallet ?? 0} />,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const meta = userStatusMap(row.original.deleted);
          return <StatusBadgeCell label={meta.label} tone={meta.tone} />;
        },
      },
      {
        id: 'verified',
        header: 'Verified',
        cell: ({ row }) =>
          row.original.isVerified ? (
            <StatusBadgeCell label="Verified" tone="success" />
          ) : (
            <StatusBadgeCell label="Unverified" tone="neutral" />
          ),
      },
      {
        id: 'createdAt',
        header: 'Joined',
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
      emptyTitle="No users match your filters"
      emptyDescription="Try widening your search or clearing filters."
    />
  );
}
