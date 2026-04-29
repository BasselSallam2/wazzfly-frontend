import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@lib/hooks/useDebounce';
import { projectsApi } from '@modules/projects/api/projects.api';
import { Input } from '@components/ui/Input';
import { Skeleton } from '@components/ui/Skeleton';
import { Icon } from '@components/ui/Icon';
import { QUERY_KEYS } from '@/config/constants';
import { formatCurrency } from '@lib/format/currency';
import type { Project } from '@/types';

interface Props {
  value: Project | null;
  onChange: (project: Project | null) => void;
  placeholder?: string;
}

export function ProjectAutocomplete({ value, onChange, placeholder = 'Search project by title…' }: Props) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 300);

  const query = useQuery({
    queryKey: [QUERY_KEYS.projects.list, 'autocomplete', debounced],
    queryFn: () =>
      projectsApi.list({
        searchBy: 'title',
        keyword: debounced,
        limit: 8,
      }),
    enabled: open && debounced.length > 0,
  });

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{value.title}</p>
          <p className="text-body-sm text-on-surface-variant">
            Budget {formatCurrency(value.Budget)} · Refunded {formatCurrency(value.refunded ?? 0)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setOpen(true);
          }}
          className="rounded p-1 text-on-surface-variant hover:bg-surface-container"
          aria-label="Change project"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        iconLeft="search"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      {open && debounced.length > 0 ? (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-outline-variant bg-surface-container-lowest p-1 shadow-popover">
          {query.isLoading ? (
            <div className="space-y-1 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (query.data?.data ?? []).length === 0 ? (
            <p className="p-3 text-body-sm text-on-surface-variant">No matches</p>
          ) : (
            (query.data?.data ?? []).map((project) => (
              <button
                key={project._id}
                type="button"
                onClick={() => {
                  onChange(project);
                  setOpen(false);
                  setKeyword('');
                }}
                className="flex w-full flex-col items-start gap-0.5 rounded p-2 text-left transition-colors hover:bg-surface-container-low"
              >
                <p className="text-label-md text-on-surface">{project.title}</p>
                <p className="text-body-sm text-on-surface-variant">
                  Budget {formatCurrency(project.Budget)} · Status {project.status}
                </p>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
