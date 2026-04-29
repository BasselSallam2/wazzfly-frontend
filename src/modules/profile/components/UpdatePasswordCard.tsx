import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/forms/FormField';
import { Button } from '@components/ui/Button';
import { authApi } from '@modules/auth/api/auth.api';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';

export function UpdatePasswordCard() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword({ oldPassword, newPassword }),
    onSuccess: () => {
      toast.success('Password updated');
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to update password'),
  });

  const valid =
    oldPassword.length >= 6 && newPassword.length >= 8 && newPassword === confirm;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>POST /auth/reset-password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Current password" htmlFor="old-password" required>
          <Input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            iconLeft="lock"
          />
        </FormField>
        <FormField label="New password" htmlFor="new-password" required hint="At least 8 characters">
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            iconLeft="lock"
          />
        </FormField>
        <FormField
          label="Confirm new password"
          htmlFor="confirm-password"
          required
          error={confirm && newPassword !== confirm ? 'Passwords do not match' : undefined}
        >
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            iconLeft="lock"
          />
        </FormField>
        <Button
          disabled={!valid}
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
          iconLeft="key"
        >
          Update password
        </Button>
      </CardContent>
    </Card>
  );
}
