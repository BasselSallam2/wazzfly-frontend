import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Avatar } from '@components/ui/Avatar';
import { Icon } from '@components/ui/Icon';
import { Button } from '@components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';
import { ROUTES } from '@/config/constants';
import { authApi } from '@modules/auth/api/auth.api';
import { tokenStorage } from '@lib/auth/tokenStorage';
import { toast } from '@components/ui/Toast';
import { NotificationsBell } from '@modules/notifications/components/NotificationsBell';
import { disconnectSocket } from '@lib/api/socket';

export interface TopNavBarProps {
  title?: string;
}

export function TopNavBar({ title = 'Overview' }: TopNavBarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  const handleLogout = async () => {
    await authApi.logout();
    tokenStorage.clear();
    clear();
    disconnectSocket();
    toast.success('Signed out');
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-topbar items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-h2 font-semibold text-on-surface">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsBell />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open chat"
          onClick={() => navigate(ROUTES.chat)}
        >
          <Icon name="chat_bubble" size={20} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-surface-container-low focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Account menu"
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <span className="hidden text-label-md font-medium text-on-surface md:inline">
                {user?.name ?? 'Admin'}
              </span>
              <Icon name="expand_more" size={18} className="hidden text-on-surface-variant md:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>{user?.email ?? 'Signed in'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate(ROUTES.profile)}>
              <Icon name="account_circle" size={18} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate(ROUTES.settings)}>
              <Icon name="tune" size={18} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => void handleLogout()}
              className="text-error focus:bg-error-container/40 focus:text-error"
            >
              <Icon name="logout" size={18} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
