import type { ReactNode } from 'react';

interface NotificationBadgeProps {
  hasNotifications: boolean;
  children: ReactNode;
}

// Wraps children in a relative container and absolutely-positions
// an orange dot when hasNotifications is true.
export function NotificationBadge({ hasNotifications, children }: NotificationBadgeProps) {
  return (
    <span className="relative inline-block">
      {children}
      {hasNotifications && (
        <span
          className="absolute top-0.5 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full pointer-events-none"
          aria-label="unread notifications"
        />
      )}
    </span>
  );
}
