import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/forms/FormField';
import { Button } from '@components/ui/Button';
import { Avatar } from '@components/ui/Avatar';
import { adminApi } from '../api/admin.api';
import { useAuthStore } from '@store/authStore';
import { QUERY_KEYS } from '@/config/constants';
import { toast } from '@components/ui/Toast';
import { isApiError } from '@lib/api/errors';
import type { User } from '@/types';

interface Props {
  user: User;
}

export function ProfileForm({ user }: Props) {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber ?? '');
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => adminApi.updateMe({ name, email, phoneNumber }),
    onSuccess: (updated) => {
      toast.success('Profile updated');
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me });
    },
    onError: (err) => toast.error(isApiError(err) ? err.message : 'Failed to update'),
  });

  const dirty =
    name !== user.name ||
    email !== user.email ||
    phoneNumber !== (user.phoneNumber ?? '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>GET /admin/me · PUT /admin/me</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatar} size="lg" />
          <div>
            <p className="text-h2 font-semibold text-on-surface">{user.name}</p>
            <p className="text-body-md text-on-surface-variant">{user.email}</p>
          </div>
        </div>
        <FormField label="Name" htmlFor="profile-name">
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="Email" htmlFor="profile-email">
          <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField label="Phone" htmlFor="profile-phone">
          <Input id="profile-phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </FormField>
        <Button onClick={() => mutation.mutate()} disabled={!dirty} loading={mutation.isPending} iconLeft="save">
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}
