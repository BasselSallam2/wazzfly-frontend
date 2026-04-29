import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageHeader } from '@components/layout/PageHeader';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Icon } from '@components/ui/Icon';
import { Skeleton } from '@components/ui/Skeleton';
import { CreditWalletCard } from '../components/CreditWalletCard';
import { RefundProjectCard } from '../components/RefundProjectCard';
import { TransactionExplorer } from '../components/TransactionExplorer';
import { settingsApi } from '@modules/settings/api/settings.api';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import { formatCurrency } from '@lib/format/currency';

export function FinancePage() {
  const settings = useQuery({
    queryKey: [QUERY_KEYS.settings.current],
    queryFn: () => settingsApi.current(),
  });

  const wallet = settings.data?.SystemWallet ?? 0;
  const charges = settings.data?.allTimeCharges ?? 0;
  const payouts = settings.data?.allTimePayouts ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance"
        description="Operate the marketplace's money: refunds, wallet credits, and a transaction explorer."
        actions={
          <Button asChild variant="secondary" iconLeft="receipt_long">
            <Link to={ROUTES.transactions}>Open transactions</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: 'System wallet', value: wallet, icon: 'account_balance', tone: 'bg-success-container text-on-success-container' },
          { label: 'All-time charges', value: charges, icon: 'arrow_downward', tone: 'bg-info-container text-on-info-container' },
          { label: 'All-time payouts', value: payouts, icon: 'arrow_upward', tone: 'bg-warning-container text-on-warning-container' },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-label-sm uppercase text-on-surface-variant">{kpi.label}</span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-md ${kpi.tone}`}>
                <Icon name={kpi.icon} size={18} />
              </span>
            </div>
            <div className="mt-2">
              {settings.isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-display tabular text-on-surface">{formatCurrency(kpi.value)}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RefundProjectCard />
        <CreditWalletCard />
      </div>

      <TransactionExplorer />
    </div>
  );
}
