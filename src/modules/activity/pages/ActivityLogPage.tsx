import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';
import { Input } from '@components/ui/Input';
import { DataTable } from '@components/data-table/DataTable';
import { DataTableToolbar } from '@components/data-table/DataTableToolbar';
import { AvatarNameCell, DateCell, IdCell } from '@components/data-table/columnHelpers';
import { activityApi, ACTIVITY_USER_POPULATE } from '../api/activity.api';
import { QUERY_KEYS } from '@/config/constants';
import type { Activity, ListQuery, User } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';

function asUser(v: string | User | null | undefined): User | null {
  return typeof v === 'object' && v ? v : null;
}

export function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filters = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (from) f['createdAt[gte]'] = from;
    if (to) f['createdAt[lte]'] = to;
    return f;
  }, [from, to]);

  const query: ListQuery = useMemo(
    () => ({
      limit: 20,
      page,
      sort: '-createdAt',
      filters,
      populate: ACTIVITY_USER_POPULATE,
    }),
    [page, filters],
  );

  const activityQuery = useQuery({
    queryKey: [QUERY_KEYS.activity.list, query],
    queryFn: () => activityApi.list(query),
    placeholderData: (prev) => prev,
  });

  const columns = useMemo<ColumnDef<Activity>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        cell: ({ row }) => <IdCell value={row.original._id} />,
      },
      {
        id: 'actor',
        header: 'Actor',
        cell: ({ row }) => {
          const u = asUser(row.original.actor ?? row.original.user);
          if (!u) return <span className="text-on-surface-variant">System</span>;
          return <AvatarNameCell name={u.name} email={u.email} src={u.avatar} />;
        },
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => <span className="text-body-md text-on-surface">{row.original.action}</span>,
      },
      {
        id: 'title',
        header: 'Title',
        cell: ({ row }) =>
          row.original.title ? (
            <span className="text-body-md text-on-surface">{row.original.title}</span>
          ) : (
            <span className="text-on-surface-variant">—</span>
          ),
      },
      {
        id: 'createdAt',
        header: 'When',
        cell: ({ row }) => <DateCell value={row.original.createdAt} />,
      },
    ],
    [],
  );

  const total = activityQuery.data?.pagination?.total ?? 0;
  const pages = activityQuery.data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Activity log"
        description="Audit every administrative event across the platform."
      />
      <DataTableToolbar
        filters={
          <>
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
          </>
        }
      />
      <DataTable
        columns={columns}
        data={activityQuery.data?.data}
        isLoading={activityQuery.isLoading}
        isError={activityQuery.isError}
        error={activityQuery.error}
        onRetry={() => activityQuery.refetch()}
        rowKey={(row) => row._id}
        emptyTitle="No activity"
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
    </div>
  );
}
