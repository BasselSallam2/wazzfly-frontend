import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { FormField } from '@components/forms/FormField';
import { MoneyInput } from '@components/forms/MoneyInput';
import { Textarea } from '@components/ui/Textarea';
import { ResultBanner } from '@components/feedback/ResultBanner';
import { toast } from '@components/ui/Toast';
import { paymentApi } from '@modules/payment/api/payment.api';
import { QUERY_KEYS } from '@/config/constants';
import { isApiError } from '@lib/api/errors';
import { formatCurrency } from '@lib/format/currency';
import type { Project } from '@/types';

interface RefundProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function RefundProjectDialog({ open, onOpenChange, project }: RefundProjectDialogProps) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  const remaining = (project.Budget ?? 0) - (project.refunded ?? 0);
  const numericAmount = mode === 'full' ? remaining : Number(amount);
  const valid = numericAmount > 0 && numericAmount <= remaining;

  const reset = () => {
    setMode('full');
    setAmount('');
    setNote('');
    setConfirmStep(false);
  };

  const mutation = useMutation({
    mutationFn: () =>
      paymentApi.refundProject({
        projectId: project._id,
        amount: mode === 'full' ? undefined : numericAmount,
        note: note || undefined,
      }),
    onSuccess: () => {
      toast.success(`Refunded ${formatCurrency(numericAmount)} for "${project.title}"`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects.detail, project._id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions.list] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.metrics });
      onOpenChange(false);
      reset();
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Refund failed'),
  });

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={confirmStep ? 'Confirm refund' : 'Refund project'}
      description={
        confirmStep
          ? 'This calls POST /payment/refund-project. Funds will move back to the client.'
          : `Project: ${project.title}. Remaining refundable: ${formatCurrency(remaining)}`
      }
      size="md"
      footer={
        confirmStep ? (
          <>
            <Button variant="ghost" onClick={() => setConfirmStep(false)} disabled={mutation.isPending}>
              Back
            </Button>
            <Button
              variant="danger"
              loading={mutation.isPending}
              onClick={() => mutation.mutate()}
              iconLeft="undo"
            >
              Refund {formatCurrency(numericAmount)}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConfirmStep(true)} disabled={!valid} iconRight="arrow_forward">
              Continue
            </Button>
          </>
        )
      }
    >
      {confirmStep ? (
        <ResultBanner
          tone="error"
          title="Money action — irreversible"
          description={
            <div className="mt-1 grid grid-cols-2 gap-2 text-body-sm">
              <span className="text-on-surface-variant">Project</span>
              <span className="text-right font-medium text-on-surface">{project.title}</span>
              <span className="text-on-surface-variant">Mode</span>
              <span className="text-right font-medium text-on-surface capitalize">{mode}</span>
              <span className="text-on-surface-variant">Refund amount</span>
              <span className="text-right font-semibold text-on-surface tabular">
                {formatCurrency(numericAmount)}
              </span>
              {note ? (
                <>
                  <span className="text-on-surface-variant">Note</span>
                  <span className="text-right text-on-surface">{note}</span>
                </>
              ) : null}
            </div>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'full' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMode('full')}
            >
              Full refund
            </Button>
            <Button
              variant={mode === 'partial' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMode('partial')}
            >
              Partial refund
            </Button>
          </div>
          {mode === 'partial' ? (
            <FormField label="Amount" htmlFor="refund-amount" required>
              <MoneyInput
                id="refund-amount"
                value={amount}
                max={remaining}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </FormField>
          ) : (
            <div className="rounded-md border border-outline-variant bg-surface-container-low p-4 text-body-md">
              Refunding the full remaining balance:{' '}
              <strong className="tabular text-on-surface">{formatCurrency(remaining)}</strong>
            </div>
          )}
          <FormField label="Note (optional)" htmlFor="refund-note">
            <Textarea
              id="refund-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for refund (visible in audit log)"
              rows={3}
            />
          </FormField>
        </div>
      )}
    </Modal>
  );
}
