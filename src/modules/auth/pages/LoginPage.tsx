import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';
import { LoginForm } from '../components/LoginForm';
import { ROUTES } from '@/config/constants';
import { Icon } from '@components/ui/Icon';

export function LoginPage() {
  const isAuthed = useAuthStore(selectIsAuthenticated);

  if (isAuthed) {
    return <Navigate to={ROUTES.overview} replace />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-on-primary lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-on-primary/10">
            <Icon name="bolt" size={22} weight={600} />
          </div>
          <div>
            <p className="text-h2 font-bold tracking-tight">Wazzfly</p>
            <p className="text-label-sm uppercase tracking-widest text-on-primary/60">
              Admin Console
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-display font-bold leading-tight">
            Operate the marketplace with confidence.
          </h2>
          <p className="max-w-md text-body-lg text-on-primary/80">
            Live KPIs, ticket triage, project refunds, and wallet credits — every action is
            audited and reversible.
          </p>
          <ul className="space-y-3 text-body-md text-on-primary/80">
            {[
              { icon: 'speed', text: 'Real-time dashboard with 60s refresh' },
              { icon: 'support_agent', text: 'Inline ticket triage with attachments' },
              { icon: 'shield', text: 'Confirm dialogs on every money action' },
            ].map((feature) => (
              <li key={feature.text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-primary/10">
                  <Icon name={feature.icon} size={16} />
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-body-sm text-on-primary/60">
          © {new Date().getFullYear()} Wazzfly · Internal admin tooling
        </p>
      </div>
      <div className="flex items-center justify-center bg-surface px-4 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-on-primary">
              <Icon name="bolt" size={18} weight={600} />
            </div>
            <span className="text-h2 font-bold tracking-tight text-on-surface">Wazzfly Admin</span>
          </div>
          <h1 className="text-h1 font-semibold text-on-surface">Sign in</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Use your admin credentials to access the operations console.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
