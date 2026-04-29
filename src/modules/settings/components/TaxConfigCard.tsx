import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { FormField } from '@components/forms/FormField';
import { PercentageInput } from '@components/forms/PercentageInput';
import { Button } from '@components/ui/Button';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { settingsApi } from '../api/settings.api';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import type { AppSettings } from '@/types';

interface Props {
  settings: AppSettings | null | undefined;
}

export function TaxConfigCard({ settings }: Props) {
  const queryClient = useQueryClient();
  const [clientTax, setClientTax] = useState('');
  const [freelancerTax, setFreelancerTax] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setClientTax(String(settings.clientTax ?? 0));
      setFreelancerTax(String(settings.freelancerTax ?? 0));
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () =>
      settingsApi.update(settings!._id, {
        clientTax: Number(clientTax),
        freelancerTax: Number(freelancerTax),
      }),
    onSuccess: () => {
      toast.success('Tax configuration updated');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.settings.current] });
      setConfirmOpen(false);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to update'),
  });

  const dirty =
    settings &&
    (Number(clientTax) !== settings.clientTax ||
      Number(freelancerTax) !== settings.freelancerTax);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax configuration</CardTitle>
        <CardDescription>GET /setting · PUT /setting/:id</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Client tax" hint="Applied to client charges">
          <PercentageInput value={clientTax} onChange={(e) => setClientTax(e.target.value)} />
        </FormField>
        <FormField label="Freelancer tax" hint="Withheld from freelancer payouts">
          <PercentageInput value={freelancerTax} onChange={(e) => setFreelancerTax(e.target.value)} />
        </FormField>
        <Button disabled={!dirty || !settings} onClick={() => setConfirmOpen(true)} iconLeft="save">
          Save changes
        </Button>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Update tax configuration?"
          description="Changes apply to new transactions immediately."
          loading={mutation.isPending}
          onConfirm={() => mutation.mutate()}
          confirmLabel="Update"
        />
      </CardContent>
    </Card>
  );
}
