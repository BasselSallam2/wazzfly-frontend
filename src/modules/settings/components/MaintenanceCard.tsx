import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { settingsApi } from '../api/settings.api';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';

export function MaintenanceCard() {
  const [target, setTarget] = useState<'cache' | 'logs' | null>(null);

  const cacheMutation = useMutation({
    mutationFn: () => settingsApi.clearCache(),
    onSuccess: () => {
      toast.success('Cache cleared');
      setTarget(null);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to clear cache'),
  });

  const logsMutation = useMutation({
    mutationFn: () => settingsApi.clearLogs(),
    onSuccess: () => {
      toast.success('Logs cleared');
      setTarget(null);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to clear logs'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance</CardTitle>
        <CardDescription>GET /clearCache · GET /clearLogs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="secondary" onClick={() => setTarget('cache')} iconLeft="cleaning_services">
          Clear cache
        </Button>
        <Button variant="secondary" onClick={() => setTarget('logs')} iconLeft="delete_history">
          Clear logs
        </Button>

        <ConfirmDialog
          open={target === 'cache'}
          onOpenChange={(o) => !o && setTarget(null)}
          title="Clear server cache?"
          description="The next requests may be slower while the cache rebuilds."
          loading={cacheMutation.isPending}
          onConfirm={() => cacheMutation.mutate()}
          confirmLabel="Clear cache"
          destructive
        />
        <ConfirmDialog
          open={target === 'logs'}
          onOpenChange={(o) => !o && setTarget(null)}
          title="Clear server logs?"
          description="Existing log files will be wiped."
          loading={logsMutation.isPending}
          onConfirm={() => logsMutation.mutate()}
          confirmLabel="Clear logs"
          destructive
        />
      </CardContent>
    </Card>
  );
}
