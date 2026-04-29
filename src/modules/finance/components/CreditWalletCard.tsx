import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { FormField } from '@components/forms/FormField';
import { MoneyInput } from '@components/forms/MoneyInput';
import { Textarea } from '@components/ui/Textarea';
import { ConfirmDialog } from '@components/feedback/ConfirmDialog';
import { UserAutocomplete } from './UserAutocomplete';
import { paymentApi } from '@modules/payment/api/payment.api';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import { formatCurrency } from '@lib/format/currency';
import type { User } from '@/types';

export function CreditWalletCard() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const numericAmount = Number(amount);
  const valid = user && numericAmount > 0;

  const mutation = useMutation({
    mutationFn: () =>
      paymentApi.creditWallet({
        userId: user!._id,
        amount: numericAmount,
        note: note || undefined,
      }),
    onSuccess: () => {
      toast.success(`Credited ${formatCurrency(numericAmount)} to ${user!.name}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.transactions.list] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.metrics });
      setUser(null);
      setAmount('');
      setNote('');
      setConfirmOpen(false);
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to credit wallet'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit user wallet</CardTitle>
        <CardDescription>POST /payment/admin-credit-wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="User" required>
          <UserAutocomplete value={user} onChange={setUser} />
        </FormField>
        <FormField label="Amount" required>
          <MoneyInput value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FormField>
        <FormField label="Note (optional)">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
        </FormField>
        <Button
          disabled={!valid}
          onClick={() => setConfirmOpen(true)}
          iconLeft="paid"
          className="w-full"
        >
          Credit {valid ? formatCurrency(numericAmount) : 'wallet'}
        </Button>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm wallet credit"
          confirmLabel={`Credit ${formatCurrency(numericAmount)}`}
          loading={mutation.isPending}
          onConfirm={() => mutation.mutate()}
          summary={
            <div className="grid grid-cols-2 gap-2 text-body-sm">
              <span className="text-on-surface-variant">User</span>
              <span className="text-right font-medium">{user?.name}</span>
              <span className="text-on-surface-variant">Amount</span>
              <span className="text-right font-semibold tabular">{formatCurrency(numericAmount)}</span>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
