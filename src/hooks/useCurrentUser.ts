import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/userApi';
import { useAuthStore } from '../stores/authStore';

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token,
  });
}
