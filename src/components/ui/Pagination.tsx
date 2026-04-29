import { cn } from '@lib/utils/cn';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  pageCount: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageCount, total, pageSize, onPageChange, className }: PaginationProps) {
  const safePageCount = Math.max(1, pageCount);
  const start = total != null && pageSize != null ? (page - 1) * pageSize + 1 : null;
  const end =
    total != null && pageSize != null ? Math.min(page * pageSize, total) : null;

  const pages: (number | 'ellipsis')[] = [];
  const window = 1;
  for (let i = 1; i <= safePageCount; i++) {
    if (i === 1 || i === safePageCount || (i >= page - window && i <= page + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="text-body-sm text-on-surface-variant tabular">
        {total != null && start != null && end != null ? (
          <>
            Showing <strong className="text-on-surface">{start}</strong>–
            <strong className="text-on-surface">{end}</strong> of{' '}
            <strong className="text-on-surface">{total}</strong>
          </>
        ) : (
          <>Page {page} of {safePageCount}</>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          iconLeft="chevron_left"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`e-${idx}`} className="px-2 text-on-surface-variant">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'primary' : 'ghost'}
              size="sm"
              className="min-w-[36px] tabular"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="ghost"
          size="sm"
          iconRight="chevron_right"
          disabled={page >= safePageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
