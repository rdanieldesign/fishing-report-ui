import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { getFriendOptions, requestFriendship } from '../api/friendApi';
import { FooterBreadcrumb } from '../components/shared/FooterBreadcrumb';

export function FriendsAddPage() {
  const queryClient = useQueryClient();

  const { data: options = [], isLoading } = useQuery({
    queryKey: ['friends', 'options'],
    queryFn: getFriendOptions,
  });

  // After a request is sent, refetch options so the sent user disappears from the list —
  // mirrors Angular's switchMap(() => getFriendOptions()) pattern.
  const mutation = useMutation({
    mutationFn: requestFriendship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', 'options'] });
    },
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Add Friends</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : options.length === 0 ? (
          <p className="text-sm text-gray-400">No users available to add.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
            {options.map((user) => (
              <li key={user.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-800">{user.name}</span>
                <button
                  type="button"
                  onClick={() => mutation.mutate(user.id)}
                  disabled={mutation.isPending}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
                  aria-label={`Add ${user.name} as a friend`}
                >
                  <UserPlus size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FooterBreadcrumb text="Friends" to="/friends/list" />
    </div>
  );
}
