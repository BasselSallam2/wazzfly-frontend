import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { DataTableToolbar } from '@components/data-table/DataTableToolbar';
import { Select } from '@components/ui/Select';
import { ProjectsTable } from '../components/ProjectsTable';
import { projectsApi, type ProjectFilters } from '../api/projects.api';
import { useDebounce } from '@lib/hooks/useDebounce';
import { QUERY_KEYS, ROUTES, PROJECT_STATUS } from '@/config/constants';
import type { ListQuery } from '@/types';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: '-Budget', label: 'Budget high → low' },
  { value: 'Budget', label: 'Budget low → high' },
];

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [sort, setSort] = useState('-createdAt');
  const debounced = useDebounce(search, 350);

  const filters: ProjectFilters = useMemo(() => {
    const f: ProjectFilters = {};
    if (statusTab !== 'all') f.status = statusTab;
    return f;
  }, [statusTab]);

  const query: ListQuery<ProjectFilters> = useMemo(
    () => ({
      limit: 12,
      page,
      sort,
      filters,
      populate: [
        { path: 'client', select: 'name email avatar' },
        { path: 'freelancer', select: 'name email avatar' },
      ],
      ...(debounced ? { searchBy: 'title', keyword: debounced } : {}),
    }),
    [page, sort, filters, debounced],
  );

  const projectsQuery = useQuery({
    queryKey: [QUERY_KEYS.projects.list, query],
    queryFn: () => projectsApi.list(query),
    placeholderData: (prev) => prev,
  });

  const total = projectsQuery.data?.pagination?.total ?? 0;
  const pages = projectsQuery.data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Projects"
        description="Filter by status, drill into milestones, edit details, or refund."
      />
      <Tabs
        value={statusTab}
        onValueChange={(v) => {
          setStatusTab(v);
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {PROJECT_STATUS.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">
              {s.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DataTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by title…"
        filters={<Select value={sort} onValueChange={setSort} options={SORT_OPTIONS} className="w-48" />}
      />
      <ProjectsTable
        data={projectsQuery.data?.data}
        isLoading={projectsQuery.isLoading}
        isError={projectsQuery.isError}
        error={projectsQuery.error}
        onRetry={() => projectsQuery.refetch()}
        onRowClick={(row) => navigate(ROUTES.projectDetails(row._id))}
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
