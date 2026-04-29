import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { SideNavBar } from './SideNavBar';
import { TopNavBar } from './TopNavBar';
import { ROUTES } from '@/config/constants';

const titleMap: Array<{ pattern: RegExp; title: string }> = [
  { pattern: new RegExp(`^${ROUTES.overview}$`), title: 'Overview' },
  { pattern: /^\/users/, title: 'Users' },
  { pattern: /^\/projects/, title: 'Projects' },
  { pattern: /^\/tickets/, title: 'Tickets' },
  { pattern: /^\/finance\/transactions/, title: 'Transactions' },
  { pattern: /^\/finance/, title: 'Finance' },
  { pattern: /^\/chat/, title: 'Chat' },
  { pattern: /^\/notifications/, title: 'Notifications' },
  { pattern: /^\/activity/, title: 'Activity log' },
  { pattern: /^\/settings/, title: 'Settings' },
  { pattern: /^\/profile/, title: 'Profile' },
];

function deriveTitle(pathname: string) {
  const found = titleMap.find((entry) => entry.pattern.test(pathname));
  return found?.title ?? 'Wazzfly Admin';
}

export function AppShell() {
  const location = useLocation();
  const title = useMemo(() => deriveTitle(location.pathname), [location.pathname]);

  return (
    <div className="flex min-h-screen bg-surface">
      <SideNavBar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopNavBar title={title} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
