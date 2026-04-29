import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { Pagination } from '@components/ui/Pagination';
import { TicketList } from '../components/TicketList';
import { TicketThread } from '../components/TicketThread';
import { ticketsApi, type TicketFilters } from '../api/tickets.api';
import { useDebounce } from '@lib/hooks/useDebounce';
import { QUERY_KEYS, ROUTES, TICKET_STATUS, TICKET_TYPE } from '@/config/constants';
import type { ListQuery } from '@/types';
import { EmptyState } from '@components/feedback/EmptyState';
import { LoadingState } from '@components/feedback/LoadingState';

export function TicketCenterPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [typeTab, setTypeTab] = useState<string>('all');
  const debounced = useDebounce(search, 300);

  const filters: TicketFilters = useMemo(() => {
    const f: TicketFilters = {};
    if (statusTab !== 'all') f.status = statusTab as TicketFilters['status'];
    if (typeTab !== 'all') f.type = typeTab as TicketFilters['type'];
    return f;
  }, [statusTab, typeTab]);

  const listQuery: ListQuery<TicketFilters> = useMemo(
    () => ({
      limit: 15,
      page,
      sort: '-updatedAt',
      filters,
      populate: [
        { path: 'user', select: 'name+email+avatar' },
        { path: 'project', select: 'title' },
      ],
      ...(debounced ? { searchBy: 'title', keyword: debounced } : {}),
    }),
    [page, filters, debounced],
  );

  const ticketsQuery = useQuery({
    queryKey: [QUERY_KEYS.tickets.list, listQuery],
    queryFn: () => ticketsApi.list(listQuery),
    placeholderData: (prev) => prev,
  });

  const ticketDetailsQuery = useQuery({
    queryKey: [QUERY_KEYS.tickets.detail, id],
    queryFn: () =>
      ticketsApi.get(id!, {
        populate: [
        { path: 'user', select: 'name+email+avatar' },
        { path: 'project', select: 'title' },
        { path: 'messages.sender', select: 'name+email+avatar' },
        ],
      }),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });

  const total = ticketsQuery.data?.pagination?.total ?? 0;
  const pages = ticketsQuery.data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Ticket center"
        description="Triage support tickets, reply with attachments, and close with action notes."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={statusTab} onValueChange={(v) => { setStatusTab(v); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {TICKET_STATUS.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={typeTab} onValueChange={(v) => { setTypeTab(v); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All types</TabsTrigger>
            {TICKET_TYPE.map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid h-[calc(100vh-260px)] min-h-[480px] grid-cols-1 gap-4 lg:grid-cols-[400px_1fr]">
        <Card className="flex flex-col overflow-hidden">
          <div className="border-b border-outline-variant p-3">
            <Input
              iconLeft="search"
              placeholder="Search tickets…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <TicketList
              tickets={ticketsQuery.data?.data}
              selectedId={id ?? null}
              onSelect={(t) => navigate(ROUTES.ticketDetails(t._id))}
              isLoading={ticketsQuery.isLoading}
              isError={ticketsQuery.isError}
              error={ticketsQuery.error}
              onRetry={() => ticketsQuery.refetch()}
            />
          </div>
          <div className="border-t border-outline-variant p-3">
            <Pagination
              page={page}
              pageCount={pages}
              total={total}
              pageSize={listQuery.limit}
              onPageChange={setPage}
            />
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          {!id ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <EmptyState
                icon="forum"
                title="Select a ticket"
                description="Pick a ticket from the queue on the left to view the conversation."
              />
            </div>
          ) : ticketDetailsQuery.isLoading ? (
            <LoadingState />
          ) : ticketDetailsQuery.data ? (
            <TicketThread ticket={ticketDetailsQuery.data} />
          ) : null}
        </Card>
      </div>
    </div>
  );
}
