import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// Outlet-based guard: any route that nests inside this renders only when authenticated.
// useAuthStore is reactive — clearing the token (e.g. on 401) triggers a re-render
// here without any imperative navigate() call needed.
export function RequireAuth() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
