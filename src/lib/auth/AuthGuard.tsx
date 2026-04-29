import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';
import { LoadingState } from '@components/feedback/LoadingState';

interface AuthGuardProps {
  children: ReactNode;
  requireRole?: 'admin';
}

export function AuthGuard({ children, requireRole = 'admin' }: AuthGuardProps) {
  const location = useLocation();
  const { user, token, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <LoadingState fullPage label="Verifying session" />;
  }

  if (!token || !user) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.login}?from=${from}`} replace />;
  }

  if (requireRole && user.type !== requireRole) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}
