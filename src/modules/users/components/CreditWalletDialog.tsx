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
import type { User } from '@/types';

interface CreditWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function CreditWalletDialog({ open, onOpenChange, user }: CreditWalletDialogProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  const reset = () => {
    setAmount('');
    setNote('');
    setConfirmStep(false);
  };

  const mutation = useMutation({
    mutationFn: () =>
      paymentApi.creditWallet({
        userId: user._id,
        amount: Number(amount),
        note: note || undefined,
      }),
    onSuccess: () => {
      toast.success(`Credited ${formatCurrency(Number(amount))} to ${user.name}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users.detail, user._id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions.list] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.metrics });
      onOpenChange(false);
      reset();
    },
    onError: (err) => {
      toast.error(isApiError(err) ? err.message : 'Failed to credit wallet');
    },
  });

  const numericAmount = Number(amount);
  const valid = numericAmount > 0;

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={confirmStep ? 'Confirm wallet credit' : 'Credit user wallet'}
      description={
        confirmStep
          ? 'Review the operation. This will create a transaction record.'
          : `Add funds to ${user.name}'s wallet. This calls POST /payment/admin-credit-wallet.`
      }
      size="md"
      footer={
        confirmStep ? (
          <>
            <Button variant="ghost" onClick={() => setConfirmStep(false)} disabled={mutation.isPending}>
              Back
            </Button>
            <Button onClick={() => mutation.mutate()} loading={mutation.isPending} iconLeft="check">
              Credit {formatCurrency(numericAmount)}
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
          tone="warning"
          title="Money action — irreversible"
          description={
            <div className="mt-1 grid grid-cols-2 gap-2 text-body-sm">
              <span className="text-on-surface-variant">User</span>
              <span className="text-right font-medium text-on-surface">{user.name}</span>
              <span className="text-on-surface-variant">Amount</span>
              <span className="text-right font-semibold text-on-surface tabular">
                {formatCurrency(numericAmount)}
              </span>
              <span className="text-on-surface-variant">New balance</span>
              <span className="text-right font-medium text-on-surface tabular">
                {formatCurrency((user.wallet ?? 0) + numericAmount)}
              </span>
            </div>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <FormField label="Amount" htmlFor="credit-amount" required>
            <MoneyInput
              id="credit-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </FormField>
          <FormField label="Note (optional)" htmlFor="credit-note" hint="Recorded in the transaction meta.">
            <Textarea
              id="credit-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Goodwill credit, support compensation, …"
              rows={3}
            />
          </FormField>
        </div>
      )}
    </Modal>
  );
}
