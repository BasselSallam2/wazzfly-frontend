import { NavLink } from 'react-router-dom';
import { cn } from '@lib/utils/cn';
import { ROUTES } from '@/config/constants';
import { Icon } from '@components/ui/Icon';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Overview', to: ROUTES.overview, icon: 'space_dashboard', end: true },
  { label: 'Users', to: ROUTES.users, icon: 'group' },
  { label: 'Projects', to: ROUTES.projects, icon: 'folder_open' },
  { label: 'Tickets', to: ROUTES.tickets, icon: 'support_agent' },
  { label: 'Finance', to: ROUTES.finance, icon: 'payments' },
  { label: 'Transactions', to: ROUTES.transactions, icon: 'receipt_long' },
  { label: 'Chat', to: ROUTES.chat, icon: 'forum' },
  { label: 'Activity', to: ROUTES.activity, icon: 'history' },
  { label: 'Notifications', to: ROUTES.notifications, icon: 'notifications' },
  { label: 'Settings', to: ROUTES.settings, icon: 'settings' },
];

export function SideNavBar() {
  return (
    <aside className="hidden h-screen w-sidebar shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest md:flex">
      <div className="flex h-topbar items-center gap-2 border-b border-outline-variant px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary">
          <Icon name="bolt" size={18} weight={600} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-label-md font-bold tracking-tight text-on-surface">Wazzfly</span>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            Admin
          </span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <p className="mb-2 px-3 text-label-sm uppercase text-on-surface-variant">Workspace</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-label-md font-medium transition-colors',
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
                  )
                }
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-outline-variant p-4 text-body-sm text-on-surface-variant">
        <div className="flex items-center justify-between">
          <span>v0.1.0</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            Live
          </span>
        </div>
      </div>
    </aside>
  );
}
