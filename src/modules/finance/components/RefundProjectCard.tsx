import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { FormField } from '@components/forms/FormField';
import { MoneyInput } from '@components/forms/MoneyInput';
import { Textarea } from '@components/ui/Textarea';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { ProjectAutocomplete } from './ProjectAutocomplete';
import { paymentApi } from '@modules/payment/api/payment.api';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import { formatCurrency } from '@lib/format/currency';
import type { Project } from '@/types';

export function RefundProjectCard() {
  const queryClient = useQueryClient();
  const [project, setProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const remaining = project ? (project.Budget ?? 0) - (project.refunded ?? 0) : 0;
  const numericAmount = mode === 'full' ? remaining : Number(amount);
  const valid = project && numericAmount > 0 && numericAmount <= remaining;

  const mutation = useMutation({
    mutationFn: () =>
      paymentApi.refundProject({
        projectId: project!._id,
        amount: mode === 'full' ? undefined : numericAmount,
        note: note || undefined,
      }),
    onSuccess: () => {
      toast.success(`Refunded ${formatCurrency(numericAmount)} for "${project!.title}"`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions.list] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.metrics });
      setProject(null);
      setAmount('');
      setNote('');
      setMode('full');
      setConfirmOpen(false);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Refund failed'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund a project</CardTitle>
        <CardDescription>POST /payment/refund-project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Project" required>
          <ProjectAutocomplete value={project} onChange={setProject} />
        </FormField>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === 'full' ? 'primary' : 'secondary'}
            onClick={() => setMode('full')}
          >
            Full
          </Button>
          <Button
            size="sm"
            variant={mode === 'partial' ? 'primary' : 'secondary'}
            onClick={() => setMode('partial')}
          >
            Partial
          </Button>
        </div>
        {mode === 'partial' ? (
          <FormField
            label="Amount"
            hint={project ? `Max refundable: ${formatCurrency(remaining)}` : undefined}
            required
          >
            <MoneyInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={remaining}
            />
          </FormField>
        ) : (
          <p className="rounded-md bg-surface-container-low px-3 py-2 text-body-sm">
            Refunding all {formatCurrency(remaining)} remaining.
          </p>
        )}
        <FormField label="Note (optional)">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
        </FormField>
        <Button
          variant="danger"
          disabled={!valid}
          onClick={() => setConfirmOpen(true)}
          iconLeft="undo"
          className="w-full"
        >
          Refund {valid ? formatCurrency(numericAmount) : 'project'}
        </Button>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm refund"
          destructive
          confirmLabel={`Refund ${formatCurrency(numericAmount)}`}
          loading={mutation.isPending}
          onConfirm={() => mutation.mutate()}
          summary={
            <div className="grid grid-cols-2 gap-2 text-body-sm">
              <span className="text-on-surface-variant">Project</span>
              <span className="text-right font-medium">{project?.title}</span>
              <span className="text-on-surface-variant">Mode</span>
              <span className="text-right capitalize">{mode}</span>
              <span className="text-on-surface-variant">Amount</span>
              <span className="text-right font-semibold tabular">{formatCurrency(numericAmount)}</span>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
