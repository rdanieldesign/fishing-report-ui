import { useQuery } from '@tanstack/react-query';
import { getFriendRequests } from '../api/friendApi';
import { useAuthStore } from '../stores/authStore';

export function useNotifications(): { hasNotifications: boolean } {
  const token = useAuthStore((state) => state.token);

  // enabled: !!token mirrors Angular's behaviour — only fetch when authenticated.
  // React Query refetches on window-focus by default, which improves on the
  // Angular version that fetched only once per login session.
  const { data: requests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
    enabled: !!token,
  });

  return { hasNotifications: Boolean(requests?.length) };
}
