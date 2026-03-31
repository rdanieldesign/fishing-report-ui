import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  getAllFriends,
  getFriendRequests,
  getPendingFriendRequests,
  confirmFriendship,
  deleteFriendship,
} from '../api/friendApi';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import type { IFriendshipDetails } from '../types/friend.types';

// All three friend query keys — invalidated together after any mutation so all
// tabs refresh simultaneously, matching Angular's combineLatest + reloadFriendLists().
const FRIEND_QUERY_KEYS = [
  ['friends', 'all'],
  ['friends', 'requests'],
  ['friends', 'pending'],
] as const;

// Tab config mirrors Angular's mat-tab-group template context variables
interface TabConfig {
  label: string;
  data: IFriendshipDetails[];
  canApprove: boolean;
  canDecline: boolean;
  canSeeEntries: boolean;
  shouldConfirmDelete: boolean;
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <span className="inline-block w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function FriendsListPage() {
  const queryClient = useQueryClient();

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    friendId: number;
  }>({ open: false, friendId: 0 });

  // Three separate queries — each has its own stale/loading state
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ['friends', 'all'],
    queryFn: getAllFriends,
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['friends', 'requests'],
    queryFn: getFriendRequests,
  });

  const { data: pending = [], isLoading: pendingLoading } = useQuery({
    queryKey: ['friends', 'pending'],
    queryFn: getPendingFriendRequests,
  });

  const isLoading = friendsLoading || requestsLoading || pendingLoading;

  function invalidateAll() {
    FRIEND_QUERY_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }

  const confirmMutation = useMutation({
    mutationFn: (friendId: number) => confirmFriendship(friendId),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (friendId: number) => deleteFriendship(friendId),
    onSuccess: invalidateAll,
  });

  function handleDeleteClick(friendId: number, shouldConfirm: boolean) {
    if (shouldConfirm) {
      setConfirmState({ open: true, friendId });
    } else {
      deleteMutation.mutate(friendId);
    }
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(confirmState.friendId);
    setConfirmState({ open: false, friendId: 0 });
  }

  const tabs: TabConfig[] = [
    { label: 'Requests', data: requests, canApprove: true, canDecline: true, canSeeEntries: false, shouldConfirmDelete: false },
    { label: 'Friends', data: friends, canApprove: false, canDecline: true, canSeeEntries: true, shouldConfirmDelete: true },
    { label: 'Pending', data: pending, canApprove: false, canDecline: false, canSeeEntries: false, shouldConfirmDelete: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Friends</h1>
        <Link
          to="/friends/add"
          className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Add New Friend
        </Link>
      </div>

      {/* Headless UI Tab replaces Angular's mat-tab-group. Tab.Group manages
          keyboard navigation and ARIA tablist/tabpanel roles automatically. */}
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium focus:outline-none border-b-2 transition-colors ${
                  selected
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="pt-3">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.label}>
              {isLoading ? (
                <Spinner />
              ) : tab.data.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No {tab.label.toLowerCase()} yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {tab.data.map((item) => (
                    <li key={item.friendId} className="flex items-center justify-between py-3">
                      {/* friendId is typed as string in the interface (from Angular source) */}
                      {tab.canSeeEntries ? (
                        <Link
                          to={`/users/${item.friendId}/entries`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {item.friendName}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-800">{item.friendName}</span>
                      )}

                      <div className="flex gap-2">
                        {tab.canApprove && (
                          <button
                            type="button"
                            onClick={() => confirmMutation.mutate(Number(item.friendId))}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Approve friend request"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {tab.canDecline && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(Number(item.friendId), tab.shouldConfirmDelete)
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove friend"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <ConfirmModal
        isOpen={confirmState.open}
        message="Are you sure you want to remove this friend?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ open: false, friendId: 0 })}
      />
    </div>
  );
}
