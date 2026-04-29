import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Select } from '@components/ui/Select';
import { Pagination } from '@components/ui/Pagination';
import { DataTableToolbar } from '@components/data-table/DataTableToolbar';
import { UsersTable } from '../components/UsersTable';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { usersApi, type UserFilters } from '../api/users.api';
import { useDebounce } from '@lib/hooks/useDebounce';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import type { ListQuery } from '@/types';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'client', label: 'Clients' },
  { value: 'freelancer', label: 'Freelancers' },
  { value: 'admin', label: 'Admins' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'name', label: 'Name A→Z' },
  { value: '-wallet', label: 'Wallet (high → low)' },
];

export function UsersListPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sort, setSort] = useState<string>('-createdAt');
  const debouncedSearch = useDebounce(search, 350);

  const filters: UserFilters = useMemo(() => {
    const f: UserFilters = {};
    if (type !== 'all') f.type = type as UserFilters['type'];
    if (status === 'suspended') f.deleted = true;
    if (status === 'active') f.deleted = false;
    return f;
  }, [type, status]);

  const query: ListQuery<UserFilters> = useMemo(
    () => ({
      limit: 15,
      page,
      sort,
      filters,
      ...(debouncedSearch ? { searchBy: 'name', keyword: debouncedSearch } : {}),
    }),
    [page, sort, filters, debouncedSearch],
  );

  const usersQuery = useQuery({
    queryKey: [QUERY_KEYS.users.list, query],
    queryFn: () => usersApi.list(query),
    placeholderData: (prev) => prev,
  });

  const total = usersQuery.data?.pagination?.total ?? 0;
  const pages = usersQuery.data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Users"
        description="Find clients, freelancers and admins. Drill in for wallet, transactions, and reviews."
      />
      <DataTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by name…"
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
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
              className="w-40"
            />
            <Select value={sort} onValueChange={setSort} options={SORT_OPTIONS} className="w-44" />
          </>
        }
      />
      <UsersTable
        data={usersQuery.data?.data}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        error={usersQuery.error}
        onRetry={() => usersQuery.refetch()}
        onRowClick={(row) => navigate(ROUTES.userDetails(row._id))}
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
      <UserDetailDrawer
        userId={id ?? null}
        open={Boolean(id)}
        onOpenChange={(open) => {
          if (!open) navigate(ROUTES.users);
        }}
      />
    </div>
  );
}
