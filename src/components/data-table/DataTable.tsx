import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { cn } from '@lib/utils/cn';
import { Skeleton } from '@components/ui/Skeleton';
import { EmptyState } from '@components/feedback/EmptyState';
import { ErrorState } from '@components/feedback/ErrorState';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  onRowClick?: (row: TData) => void;
  density?: 'standard' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  className?: string;
  rowKey?: (row: TData, index: number) => string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  onRowClick,
  density = 'standard',
  emptyTitle = 'No results',
  emptyDescription = 'Try adjusting your filters or search terms.',
  emptyAction,
  sorting,
  onSortingChange,
  className,
  rowKey,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    manualSorting: true,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting ?? []) : updater;
      onSortingChange?.(next);
    },
  });

  const rowHeight = density === 'compact' ? 'h-10' : 'h-12';

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest',
        className,
      )}
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-surface-container-low text-label-sm uppercase tracking-wide text-on-surface-variant">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-outline-variant px-4 py-3 font-semibold"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className={cn(rowHeight, 'border-b border-outline-variant')}>
                    {columns.map((_col, cIdx) => (
                      <td key={cIdx} className="px-4 py-2">
                        <Skeleton className="h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.length === 0
                ? null
                : table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={rowKey ? rowKey(row.original, idx) : row.id}
                      className={cn(
                        rowHeight,
                        'border-b border-outline-variant transition-colors hover:bg-surface-container-low last:border-b-0',
                        onRowClick && 'cursor-pointer',
                      )}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-2 text-body-md text-on-surface">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      {!isLoading && (data?.length ?? 0) === 0 ? (
        <div className="px-6 py-8">
          <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
        </div>
      ) : null}
    </div>
  );
}
