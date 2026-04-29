import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, type LoginResponse } from '../api/auth.api';
import { loginSchema, type LoginInput } from '../schema/login.schema';
import { useAuthStore } from '@store/authStore';
import { tokenStorage } from '@lib/auth/tokenStorage';
import { connectSocket } from '@lib/api/socket';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/forms/FormField';
import { toast } from '@components/ui/Toast';
import { ROUTES } from '@/config/constants';
import { isApiError } from '@lib/api/errors';
import { mergeUserTypeFromToken } from '@lib/auth/mergeUserType';

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (input) => authApi.login(input),
    onSuccess: (data) => {
      // Admin collection users omit `type` on the user document; JWT always carries `type: "admin"`.
      const user = mergeUserTypeFromToken(data.user, data.token);
      if (user.type !== 'admin') {
        toast.error('This portal is for admins only.');
        return;
      }
      tokenStorage.write(data.token);
      setSession({ token: data.token, user });
      try {
        connectSocket();
      } catch {
        // Socket is best-effort; REST still drives the app.
      }
      toast.success(`Welcome back, ${data.user.name?.split(' ')[0] ?? 'admin'}`);
      const from = searchParams.get('from');
      navigate(from ? decodeURIComponent(from) : ROUTES.overview, { replace: true });
    },
    onError: (err) => {
      const message = isApiError(err) ? err.message : 'Unable to sign in';
      toast.error(message);
    },
  });

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-5">
      <FormField
        label="Email"
        htmlFor="email"
        error={form.formState.errors.email?.message}
        required
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          iconLeft="mail"
          placeholder="admin@wazzfly.com"
          invalid={Boolean(form.formState.errors.email)}
          {...form.register('email')}
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="password"
        error={form.formState.errors.password?.message}
        required
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          iconLeft="lock"
          placeholder="••••••••"
          invalid={Boolean(form.formState.errors.password)}
          {...form.register('password')}
        />
      </FormField>
      <Button
        type="submit"
        size="lg"
        variant="primary"
        className="!text-white hover:!text-white"
        loading={mutation.isPending}
        iconRight={mutation.isPending ? undefined : 'arrow_forward'}
      >
        Sign in to dashboard
      </Button>
    </form>
  );
}
