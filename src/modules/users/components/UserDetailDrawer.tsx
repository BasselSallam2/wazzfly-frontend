import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Drawer } from '@components/ui/Drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { LoadingState } from '@components/feedback/LoadingState';
import { ErrorState } from '@components/feedback/ErrorState';
import { EmptyState } from '@components/feedback/EmptyState';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { Icon } from '@components/ui/Icon';
import { CreditWalletDialog } from './CreditWalletDialog';
import { usersApi } from '../api/users.api';
import { transactionsApi } from '@modules/transactions/api/transactions.api';
import { reviewsApi } from '@modules/reviews/api/reviews.api';
import { QUERY_KEYS } from '@/config/constants';
import { formatCurrency } from '@lib/format/currency';
import { formatDateTime, formatRelative } from '@lib/format/date';
import { userTypeMap } from '@components/data-table/statusMaps';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';

interface UserDetailDrawerProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDrawer({ userId, open, onOpenChange }: UserDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [creditOpen, setCreditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const userQuery = useQuery({
    queryKey: [QUERY_KEYS.users.detail, userId],
    queryFn: () => usersApi.get(userId!),
    enabled: Boolean(userId) && open,
  });

  const txQuery = useQuery({
    queryKey: [QUERY_KEYS.transactions.list, 'user', userId],
    queryFn: () =>
      transactionsApi.list({
        sort: '-createdAt',
        limit: 10,
        populate: [
          { path: 'from', select: 'name email avatar' },
          { path: 'to', select: 'name email avatar' },
        ],
      }),
    enabled: Boolean(userId) && open,
  });

  const reviewsQuery = useQuery({
    queryKey: [QUERY_KEYS.reviews.list, 'user', userId],
    queryFn: () => reviewsApi.list({ filters: { user: userId! }, limit: 10, sort: '-createdAt' }),
    enabled: Boolean(userId) && open,
  });

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.remove(userId!),
    onSuccess: () => {
      toast.success('User suspended');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users.list] });
      setConfirmDelete(false);
      onOpenChange(false);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to suspend user'),
  });

  const user = userQuery.data;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="User details" width="lg">
      {userQuery.isLoading ? (
        <LoadingState />
      ) : userQuery.isError ? (
        <ErrorState error={userQuery.error} onRetry={() => userQuery.refetch()} />
      ) : user ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <Avatar src={user.avatar} name={user.name} size="lg" />
              <div>
                <h2 className="text-h2 font-semibold text-on-surface">{user.name}</h2>
                <p className="text-body-md text-on-surface-variant">{user.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone={userTypeMap[user.type]?.tone ?? 'neutral'} dot>
                    {userTypeMap[user.type]?.label ?? user.type}
                  </Badge>
                  {user.isVerified ? <Badge tone="success">Verified</Badge> : null}
                  {user.deleted ? <Badge tone="error">Suspended</Badge> : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-outline-variant p-3">
              <p className="text-label-sm uppercase text-on-surface-variant">Wallet</p>
              <p className="mt-1 text-h2 font-semibold tabular text-on-surface">
                {formatCurrency(user.wallet ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-outline-variant p-3">
              <p className="text-label-sm uppercase text-on-surface-variant">Country</p>
              <p className="mt-1 text-body-md text-on-surface">{user.country ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-outline-variant p-3">
              <p className="text-label-sm uppercase text-on-surface-variant">Joined</p>
              <p className="mt-1 text-body-md text-on-surface">{formatDateTime(user.createdAt)}</p>
            </div>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <dl className="grid grid-cols-2 gap-4 text-body-md">
                <div>
                  <dt className="text-label-sm uppercase text-on-surface-variant">Phone</dt>
                  <dd className="mt-1 text-on-surface">{user.phoneNumber ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-label-sm uppercase text-on-surface-variant">User ID</dt>
                  <dd className="mt-1 font-mono text-body-sm text-on-surface">{user._id}</dd>
                </div>
                {'title' in user && user.title ? (
                  <div className="col-span-2">
                    <dt className="text-label-sm uppercase text-on-surface-variant">Title</dt>
                    <dd className="mt-1 text-on-surface">{user.title}</dd>
                  </div>
                ) : null}
                {'bio' in user && user.bio ? (
                  <div className="col-span-2">
                    <dt className="text-label-sm uppercase text-on-surface-variant">Bio</dt>
                    <dd className="mt-1 text-on-surface">{user.bio}</dd>
                  </div>
                ) : null}
                {'organization' in user && user.organization?.name ? (
                  <div className="col-span-2">
                    <dt className="text-label-sm uppercase text-on-surface-variant">Organization</dt>
                    <dd className="mt-1 text-on-surface">{user.organization.name}</dd>
                  </div>
                ) : null}
              </dl>
            </TabsContent>

            <TabsContent value="wallet">
              <div className="rounded-lg border border-outline-variant p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label-sm uppercase text-on-surface-variant">Current balance</p>
                    <p className="mt-1 text-display tabular text-on-surface">
                      {formatCurrency(user.wallet ?? 0)}
                    </p>
                  </div>
                  <Button onClick={() => setCreditOpen(true)} iconLeft="add">
                    Credit wallet
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              {txQuery.isLoading ? (
                <LoadingState />
              ) : (txQuery.data?.data ?? []).length === 0 ? (
                <EmptyState icon="receipt_long" title="No transactions" />
              ) : (
                <ul className="flex flex-col gap-2">
                  {(txQuery.data?.data ?? []).map((tx) => (
                    <li
                      key={tx._id}
                      className="flex items-center justify-between rounded-md border border-outline-variant p-3"
                    >
                      <div>
                        <p className="text-label-md text-on-surface">{tx.type}</p>
                        <p className="text-body-sm text-on-surface-variant">{formatRelative(tx.createdAt)}</p>
                      </div>
                      <span className="tabular text-label-md font-semibold text-on-surface">
                        {formatCurrency(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {reviewsQuery.isLoading ? (
                <LoadingState />
              ) : (reviewsQuery.data?.data ?? []).length === 0 ? (
                <EmptyState icon="reviews" title="No reviews" />
              ) : (
                <ul className="flex flex-col gap-2">
                  {(reviewsQuery.data?.data ?? []).map((r) => (
                    <li key={r._id} className="rounded-md border border-outline-variant p-3">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: r.stars }).map((_, idx) => (
                          <Icon key={idx} name="star" size={14} filled className="text-warning" />
                        ))}
                        <span className="text-body-sm text-on-surface-variant">
                          {formatRelative(r.createdAt)}
                        </span>
                      </div>
                      {r.title ? <p className="mt-2 font-medium text-on-surface">{r.title}</p> : null}
                      {r.description ? (
                        <p className="mt-1 text-body-md text-on-surface-variant">{r.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between border-t border-outline-variant pt-4">
            <Button variant="danger" iconLeft="block" onClick={() => setConfirmDelete(true)} disabled={user.deleted}>
              {user.deleted ? 'Already suspended' : 'Suspend user'}
            </Button>
            <Button variant="primary" onClick={() => setCreditOpen(true)} iconLeft="paid">
              Credit wallet
            </Button>
          </div>

          <CreditWalletDialog open={creditOpen} onOpenChange={setCreditOpen} user={user} />
          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title={`Suspend ${user.name}?`}
            description="They will lose access to the platform. Their data will be retained."
            confirmLabel="Suspend user"
            destructive
            loading={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate()}
          />
        </div>
      ) : null}
    </Drawer>
  );
}
