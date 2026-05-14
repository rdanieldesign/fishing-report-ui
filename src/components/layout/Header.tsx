import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu, Plus } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationBadge } from "../shared/NotificationBadge";
import { Button } from "../shared/Button";
import { getCurrentUser } from "../../api/userApi";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const token = useAuthStore((state) => state.token);
  const { hasNotifications } = useNotifications();

  // Only fetch current user when authenticated.
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
  });
  const userInitials = currentUser
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : null;

  const homeHref = token ? "/entries" : "/login";

  return (
    <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-8 shrink-0 z-10">
      {/* Brand / home link */}
      <Link
        to={homeHref}
        className="font-semibold text-white no-underline hover:opacity-80"
      >
        <span className="font-heading tracking-wider text-2xl">Currents</span>
      </Link>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        {currentUser && (
          <Button link="/entries/create" className="!py-1 !px-2 !md:px-4">
            <Plus size={16} className="inline-block -mt-0.5" />
            <span className="hidden md:inline ml-1">New Report</span>
          </Button>
        )}

        {currentUser && (
          <Link
            to="/my-entries"
            className="text-sm text-white border-white border rounded-sm px-1 py-0.5 no-underline hover:opacity-80"
          >
            {userInitials}
          </Link>
        )}

        {/* Hamburger toggles sidenav — calls parent-provided handler */}
        <NotificationBadge
          hasNotifications={hasNotifications}
          className="!flex align-items-center"
        >
          <button
            onClick={onMenuClick}
            className="text-white hover:opacity-80 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu size={24} />
          </button>
        </NotificationBadge>
      </div>
    </header>
  );
}
