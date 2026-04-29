import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@components/layout/AppShell';
import { AuthGuard } from '@lib/auth/AuthGuard';
import { LoadingState } from '@components/feedback/LoadingState';
import { ROUTES } from '@/config/constants';

const LoginPage = lazy(() =>
  import('@modules/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const OverviewPage = lazy(() =>
  import('@modules/overview/pages/OverviewPage').then((m) => ({ default: m.OverviewPage })),
);
const UsersPage = lazy(() =>
  import('@modules/users/pages/UsersListPage').then((m) => ({ default: m.UsersListPage })),
);
const ProjectsPage = lazy(() =>
  import('@modules/projects/pages/ProjectsListPage').then((m) => ({ default: m.ProjectsListPage })),
);
const ProjectDetailsPage = lazy(() =>
  import('@modules/projects/pages/ProjectDetailsPage').then((m) => ({
    default: m.ProjectDetailsPage,
  })),
);
const TicketsPage = lazy(() =>
  import('@modules/tickets/pages/TicketCenterPage').then((m) => ({ default: m.TicketCenterPage })),
);
const FinancePage = lazy(() =>
  import('@modules/finance/pages/FinancePage').then((m) => ({ default: m.FinancePage })),
);
const TransactionsPage = lazy(() =>
  import('@modules/transactions/pages/TransactionsPage').then((m) => ({
    default: m.TransactionsPage,
  })),
);
const ChatPage = lazy(() =>
  import('@modules/chat/pages/ChatPage').then((m) => ({ default: m.ChatPage })),
);
const NotificationsPage = lazy(() =>
  import('@modules/notifications/pages/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
  })),
);
const ActivityLogPage = lazy(() =>
  import('@modules/activity/pages/ActivityLogPage').then((m) => ({ default: m.ActivityLogPage })),
);
const SettingsPage = lazy(() =>
  import('@modules/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const ProfilePage = lazy(() =>
  import('@modules/profile/pages/AdminProfilePage').then((m) => ({ default: m.AdminProfilePage })),
);
const NotFoundPage = lazy(() =>
  import('@modules/common/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<LoadingState fullPage label="Loading…" />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: withSuspense(<LoginPage />),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: withSuspense(<OverviewPage />) },
      { path: 'users', element: withSuspense(<UsersPage />) },
      { path: 'users/:id', element: withSuspense(<UsersPage />) },
      { path: 'projects', element: withSuspense(<ProjectsPage />) },
      { path: 'projects/:id', element: withSuspense(<ProjectDetailsPage />) },
      { path: 'tickets', element: withSuspense(<TicketsPage />) },
      { path: 'tickets/:id', element: withSuspense(<TicketsPage />) },
      { path: 'finance', element: withSuspense(<FinancePage />) },
      { path: 'finance/transactions', element: withSuspense(<TransactionsPage />) },
      { path: 'finance/transactions/:id', element: withSuspense(<TransactionsPage />) },
      { path: 'chat', element: withSuspense(<ChatPage />) },
      { path: 'chat/:id', element: withSuspense(<ChatPage />) },
      { path: 'notifications', element: withSuspense(<NotificationsPage />) },
      { path: 'activity', element: withSuspense(<ActivityLogPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.overview} replace />,
  },
]);
