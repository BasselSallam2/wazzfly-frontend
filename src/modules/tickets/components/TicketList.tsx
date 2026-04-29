import { cn } from '@lib/utils/cn';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Skeleton } from '@components/ui/Skeleton';
import { EmptyState } from '@components/feedback/EmptyState';
import { ErrorState } from '@components/feedback/ErrorState';
import { ticketStatusMap, ticketTypeMap } from '@components/data-table/statusMaps';
import { formatRelative } from '@lib/format/date';
import type { Ticket, User } from '@/types';

interface TicketListProps {
  tickets: Ticket[] | undefined;
  selectedId?: string | null;
  onSelect: (ticket: Ticket) => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

function asUser(value: string | User | null | undefined): User | null {
  return typeof value === 'object' && value ? value : null;
}

export function TicketList({
  tickets,
  selectedId,
  onSelect,
  isLoading,
  isError,
  error,
  onRetry,
}: TicketListProps) {
  if (isError) return <ErrorState error={error} onRetry={onRetry} />;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }
  if ((tickets?.length ?? 0) === 0)
    return <EmptyState icon="support_agent" title="No tickets" />;

  return (
    <ul className="flex flex-col">
      {tickets!.map((ticket) => {
        const user = asUser(ticket.user);
        const statusMeta = ticketStatusMap[ticket.status] ?? {
          label: ticket.status,
          tone: 'neutral' as const,
        };
        const typeMeta = ticketTypeMap[ticket.type] ?? {
          label: ticket.type,
          tone: 'neutral' as const,
        };
        const isSelected = ticket._id === selectedId;
        return (
          <li key={ticket._id}>
            <button
              type="button"
              onClick={() => onSelect(ticket)}
              className={cn(
                'flex w-full items-start gap-3 border-b border-outline-variant p-3 text-left transition-colors hover:bg-surface-container-low',
                isSelected && 'bg-primary-container/40 hover:bg-primary-container/40',
              )}
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-label-md font-medium text-on-surface">
                    {ticket.title || 'Ticket'}
                  </p>
                  <span className="text-body-sm text-on-surface-variant">
                    {formatRelative(ticket.updatedAt)}
                  </span>
                </div>
                <p className="line-clamp-1 text-body-sm text-on-surface-variant">
                  {user?.name ?? 'Unknown user'} · {ticket.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={typeMeta.tone}>{typeMeta.label}</Badge>
                  <Badge tone={statusMeta.tone} dot>
                    {statusMeta.label}
                  </Badge>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
