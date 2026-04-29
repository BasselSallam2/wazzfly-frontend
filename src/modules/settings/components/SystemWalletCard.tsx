import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { formatCurrency } from '@lib/format/currency';
import type { AppSettings } from '@/types';

interface Props {
  settings: AppSettings | null | undefined;
  loading?: boolean;
}

export function SystemWalletCard({ settings, loading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System wallet</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <p className="text-display tabular text-on-surface">
            {formatCurrency(settings?.SystemWallet ?? 0)}
          </p>
        )}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-body-md">
          <div>
            <dt className="text-label-sm uppercase text-on-surface-variant">All-time charges</dt>
            <dd className="mt-1 tabular text-on-surface">
              {formatCurrency(settings?.allTimeCharges ?? 0)}
            </dd>
          </div>
          <div>
            <dt className="text-label-sm uppercase text-on-surface-variant">All-time payouts</dt>
            <dd className="mt-1 tabular text-on-surface">
              {formatCurrency(settings?.allTimePayouts ?? 0)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
