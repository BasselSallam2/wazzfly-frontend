import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@components/layout/PageHeader';
import { LoadingState } from '@components/feedback/LoadingState';
import { TaxConfigCard } from '../components/TaxConfigCard';
import { SystemWalletCard } from '../components/SystemWalletCard';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { settingsApi } from '../api/settings.api';
import { QUERY_KEYS } from '@/config/constants';

export function SettingsPage() {
  const settings = useQuery({
    queryKey: [QUERY_KEYS.settings.current],
    queryFn: () => settingsApi.current(),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure platform tax, monitor the system wallet, and manage server maintenance."
      />
      {settings.isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <TaxConfigCard settings={settings.data} />
          <SystemWalletCard settings={settings.data} loading={settings.isLoading} />
          <MaintenanceCard />
        </div>
      )}
    </div>
  );
}
