import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { KpiGrid } from '../components/KpiGrid';
import { ProjectStatusDonut } from '../components/ProjectStatusDonut';
import { TicketStatusBar } from '../components/TicketStatusBar';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { RecentTransactionsCard } from '../components/RecentTransactionsCard';
import { PageHeader } from '@components/layout/PageHeader';
import { Button } from '@components/ui/Button';
import { ErrorState } from '@components/feedback/ErrorState';
import { QUERY_KEYS } from '@/config/constants';
import { env } from '@/config/env';

export function OverviewPage() {
  const metricsQuery = useQuery({
    queryKey: QUERY_KEYS.dashboard.metrics,
    queryFn: () => dashboardApi.metrics(),
    refetchInterval: env.VITE_DASHBOARD_REFRESH_MS,
    staleTime: env.VITE_DASHBOARD_REFRESH_MS / 2,
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Operations overview"
        description="Live snapshot of users, projects, tickets, and money flowing through Wazzfly."
        actions={
          <Button
            variant="secondary"
            iconLeft="refresh"
            onClick={() => void metricsQuery.refetch()}
            loading={metricsQuery.isFetching}
          >
            Refresh
          </Button>
        }
      />
      {metricsQuery.isError ? (
        <ErrorState error={metricsQuery.error} onRetry={() => metricsQuery.refetch()} />
      ) : (
        <>
          <KpiGrid metrics={metricsQuery.data} loading={metricsQuery.isLoading} />
          <div className="grid gap-4 lg:grid-cols-2">
            <ProjectStatusDonut
              byStatus={metricsQuery.data?.projects.byStatus}
              loading={metricsQuery.isLoading}
            />
            <TicketStatusBar
              byType={metricsQuery.data?.tickets.byType}
              byStatus={metricsQuery.data?.tickets.byStatus}
              loading={metricsQuery.isLoading}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <RecentActivityCard />
            <RecentTransactionsCard />
          </div>
        </>
      )}
    </div>
  );
}
