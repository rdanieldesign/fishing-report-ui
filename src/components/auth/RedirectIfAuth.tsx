import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Inverse of RequireAuth: wraps login/signup so an already-authenticated user
// is bounced straight to /entries instead of seeing the auth forms again.
export function RedirectIfAuth() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/entries" replace />;
  }

  return <Outlet />;
}
