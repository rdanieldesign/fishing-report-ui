import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBadge } from '../shared/NotificationBadge';
import { getCurrentUser } from '../../api/userApi';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const token = useAuthStore((state) => state.token);
  const { hasNotifications } = useNotifications();

  // Only fetch current user when authenticated.
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token,
  });

  const homeHref = token ? '/entries' : '/login';

  return (
    <header className="h-14 bg-blue-700 text-white flex items-center justify-between px-4 shrink-0 z-10">
      {/* Brand / home link */}
      <Link to={homeHref} className="font-semibold text-white no-underline hover:opacity-80">
        Fishing Report
      </Link>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        {currentUser && (
          <Link to="/my-entries" className="text-sm text-white no-underline hover:opacity-80">
            {currentUser.name}
          </Link>
        )}

        {/* Notification bell with badge overlay */}
        <NotificationBadge hasNotifications={hasNotifications}>
          <Bell size={20} />
        </NotificationBadge>

        {/* Hamburger toggles sidenav — calls parent-provided handler */}
        <button
          onClick={onMenuClick}
          className="text-white hover:opacity-80 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
