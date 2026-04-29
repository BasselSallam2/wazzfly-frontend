import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@lib/hooks/useDebounce';
import { usersApi } from '@modules/users/api/users.api';
import { Input } from '@components/ui/Input';
import { Avatar } from '@components/ui/Avatar';
import { Skeleton } from '@components/ui/Skeleton';
import { QUERY_KEYS } from '@/config/constants';
import { Icon } from '@components/ui/Icon';
import type { User } from '@/types';

interface Props {
  value: User | null;
  onChange: (user: User | null) => void;
  type?: 'client' | 'freelancer';
  placeholder?: string;
}

export function UserAutocomplete({ value, onChange, type, placeholder = 'Search user by name…' }: Props) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 300);

  const query = useQuery({
    queryKey: [QUERY_KEYS.users.list, 'autocomplete', type, debounced],
    queryFn: () =>
      usersApi.list({
        searchBy: 'name',
        keyword: debounced,
        limit: 8,
        filters: type ? { type } : {},
      }),
    enabled: open && debounced.length > 0,
  });

  if (value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar name={value.name} src={value.avatar} size="sm" />
          <div>
            <p className="text-label-md font-medium text-on-surface">{value.name}</p>
            <p className="text-body-sm text-on-surface-variant">{value.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setOpen(true);
          }}
          className="rounded p-1 text-on-surface-variant hover:bg-surface-container"
          aria-label="Change user"
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
            (query.data?.data ?? []).map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => {
                  onChange(user);
                  setOpen(false);
                  setKeyword('');
                }}
                className="flex w-full items-center gap-3 rounded p-2 text-left transition-colors hover:bg-surface-container-low"
              >
                <Avatar name={user.name} src={user.avatar} size="sm" />
                <div>
                  <p className="text-label-md text-on-surface">{user.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
