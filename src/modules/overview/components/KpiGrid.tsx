import { KpiCard } from './KpiCard';
import { formatNumber } from '@lib/format/number';
import { formatCurrency, formatCompactCurrency } from '@lib/format/currency';
import type { DashboardMetrics } from '@/types';

interface KpiGridProps {
  metrics?: DashboardMetrics;
  loading?: boolean;
}

export function KpiGrid({ metrics, loading }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <KpiCard
        label="Total users"
        value={metrics ? formatNumber(metrics.users.total) : '—'}
        icon="group"
        tone="primary"
        loading={loading}
        helper={
          metrics
            ? `${formatNumber(metrics.users.clients)} clients · ${formatNumber(metrics.users.freelancers)} freelancers`
            : undefined
        }
      />
      <KpiCard
        label="Active projects"
        value={metrics ? formatNumber(metrics.projects.active) : '—'}
        icon="folder_open"
        tone="info"
        loading={loading}
        helper={
          metrics
            ? `${formatNumber(metrics.projects.total)} all-time`
            : undefined
        }
      />
      <KpiCard
        label="Open tickets"
        value={metrics ? formatNumber(metrics.tickets.pending) : '—'}
        icon="support_agent"
        tone="warning"
        loading={loading}
        helper={
          metrics ? `${formatNumber(metrics.tickets.closed)} closed` : undefined
        }
      />
      <KpiCard
        label="System wallet"
        value={metrics ? formatCompactCurrency(metrics.money.SystemWallet) : '—'}
        icon="account_balance_wallet"
        tone="success"
        loading={loading}
        helper={
          metrics
            ? `Net profit ${formatCurrency(metrics.money.netProfit)}`
            : undefined
        }
      />
      <KpiCard
        label="Revenue"
        value={metrics ? formatCompactCurrency(metrics.money.revenue) : '—'}
        icon="trending_up"
        tone="primary"
        loading={loading}
        helper={
          metrics
            ? `Charges ${formatCompactCurrency(metrics.money.allTimeCharges)}`
            : undefined
        }
      />
    </div>
  );
}
