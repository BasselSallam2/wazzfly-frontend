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
import { projectStatusMap } from '@components/data-table/statusMaps';
import type { Project, User } from '@/types';

interface ProjectsTableProps {
  data: Project[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRowClick?: (row: Project) => void;
  onRetry?: () => void;
}

function asUser(value: string | User | null | undefined): User | null {
  return typeof value === 'object' && value ? value : null;
}

export function ProjectsTable({ data, isLoading, isError, error, onRowClick, onRetry }: ProjectsTableProps) {
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: 'project',
        header: 'Project',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-label-md font-medium text-on-surface">{row.original.title}</span>
            <span className="line-clamp-1 text-body-sm text-on-surface-variant">
              {row.original.description}
            </span>
          </div>
        ),
      },
      {
        id: 'client',
        header: 'Client',
        cell: ({ row }) => {
          const u = asUser(row.original.client);
          return <AvatarNameCell name={u?.name ?? '—'} email={u?.email} src={u?.avatar} />;
        },
      },
      {
        id: 'freelancer',
        header: 'Freelancer',
        cell: ({ row }) => {
          const u = asUser(row.original.freelancer);
          if (!u) return <span className="text-on-surface-variant">Unassigned</span>;
          return <AvatarNameCell name={u.name} email={u.email} src={u.avatar} />;
        },
      },
      {
        id: 'budget',
        header: 'Budget',
        cell: ({ row }) => <CurrencyCell amount={row.original.Budget} />,
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const meta = projectStatusMap[row.original.status] ?? {
            label: row.original.status,
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
      {
        id: 'id',
        header: 'ID',
        cell: ({ row }) => <IdCell value={row.original._id} />,
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
      emptyTitle="No projects yet"
    />
  );
}
