import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBadge } from '../shared/NotificationBadge';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// Shared NavLink class helper — highlights the active route.
// NavLink provides an isActive boolean via its className callback.
function navItemClass({ isActive }: { isActive: boolean }) {
  return `block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 rounded ${isActive ? 'font-semibold text-blue-700' : 'text-gray-700'}`;
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();
  const { hasNotifications } = useNotifications();

  function handleLogout() {
    clearToken();
    navigate('/login');
    onClose();
  }

  return (
    <>
      {/* Backdrop overlay — clicking it closes the nav, matching MatSidenav behaviour */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — slides in from the left */}
      <nav
        className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 flex flex-col z-30 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <ul className="flex-1 py-4 space-y-1">
          <li>
            <NavLink to="/my-entries" className={navItemClass} onClick={onClose}>
              My Reports
            </NavLink>
          </li>

          <li className="border-t border-gray-100" />

          <li>
            <NavLink to="/entries" end className={navItemClass} onClick={onClose}>
              All Reports
            </NavLink>
          </li>

          <li className="border-t border-gray-100" />

          <li>
            <NavLink to="/friends/list" className={navItemClass} onClick={onClose}>
              <NotificationBadge hasNotifications={hasNotifications}>
                <span className="pr-3">Friends</span>
              </NotificationBadge>
            </NavLink>
          </li>

          <li className="border-t border-gray-100" />
        </ul>

        {/* Logout sits at the bottom of the flex column */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-gray-700 hover:text-red-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      </nav>
    </>
  );
}
