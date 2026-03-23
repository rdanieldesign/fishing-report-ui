import { useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { getAllEntries, getMyEntries, deleteEntry } from '../api/entryApi';
import { getUserById, getCurrentUser } from '../api/userApi';
import { getLocationById } from '../api/locationApi';
import { useAuthStore } from '../stores/authStore';
import { FilterPanel } from '../components/entries/FilterPanel';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { formatFiltersAsText } from '../utils/filterUtils';
import { FilterFieldParams, FilterFields } from '../types/filter.types';
import type { IFilter } from '../types/filter.types';
import type { IStringMap } from '../types/generic.types';

// This component serves four routes by detecting which URL pattern is active.
export function EntryListPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  // Detect which route variant is active
  const userMatch = useMatch('/users/:userId/entries');
  const locationMatch = useMatch('/locations/:locationId/entries');
  const myEntriesMatch = useMatch('/my-entries');

  const isUserView = !!userMatch;
  const isLocationView = !!locationMatch;
  const isMyEntries = !!myEntriesMatch;

  const userId = userMatch?.params.userId;
  const locationId = locationMatch?.params.locationId;

  // Applied filters from FilterPanel (only relevant for /entries and /my-entries)
  const [appliedFilters, setAppliedFilters] = useState<IFilter[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Confirm-delete modal state — lifted here so deleteEntry can trigger it imperatively
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    entryId: string;
  }>({ open: false, entryId: '' });

  // Optional header-data queries — enabled only for the relevant route
  const { data: headerUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(Number(userId)),
    enabled: isUserView && !!userId,
  });

  const { data: headerLocation } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocationById(Number(locationId)),
    enabled: isLocationView && !!locationId,
  });

  // Current user — needed to gate the delete button on authorId
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token,
  });

  // Build the params object that goes to the API
  // Cast field.value to FilterFields so TypeScript can index the const record
  const filterParams: IStringMap = appliedFilters.reduce(
    (acc, f) => ({ ...acc, [FilterFieldParams[f.field.value as FilterFields]]: f.value.value.toString() }),
    {} as IStringMap
  );

  const urlParams: IStringMap = isUserView && userId
    ? { authorId: userId }
    : isLocationView && locationId
    ? { locationId }
    : {};

  const queryParams = { ...urlParams, ...filterParams };

  // Single entries query; queryKey includes queryParams so React Query refetches
  // when filters or URL params change.
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['entries', isMyEntries ? 'mine' : isUserView ? 'user' : isLocationView ? 'location' : 'all', queryParams],
    queryFn: () => isMyEntries ? getMyEntries(queryParams) : getAllEntries(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      // Invalidate the currently active entries query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });

  // Determine display config from route
  const pageHeader = isUserView
    ? (headerUser?.name ?? '…')
    : isLocationView
    ? (headerLocation?.name ?? '…')
    : isMyEntries
    ? 'My Reports'
    : 'All Reports';

  const showCreate = isMyEntries;
  const showFilters = !isUserView && !isLocationView;

  function handleApplyFilters(filters: IFilter[]) {
    setAppliedFilters(filters);
    setFiltersOpen(false);
  }

  function handleClearFilters() {
    setAppliedFilters([]);
    setFiltersOpen(false);
  }

  function handleDeleteClick(id: string) {
    setConfirmState({ open: true, entryId: id });
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(confirmState.entryId);
    setConfirmState({ open: false, entryId: '' });
  }

  function handleCancelDelete() {
    setConfirmState({ open: false, entryId: '' });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">{pageHeader}</h1>

      {showCreate && (
        <Link
          to="/entries/create"
          className="inline-block px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Create New Entry
        </Link>
      )}

      {/* Collapsible filter accordion */}
      {showFilters && (
        <div className="border border-gray-200 rounded">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Filters</span>
            {/* Show applied filter summary when collapsed */}
            {!filtersOpen && appliedFilters.length > 0 && (
              <span className="text-xs text-gray-500 font-normal">
                {formatFiltersAsText(appliedFilters)}
              </span>
            )}
            <span className="text-gray-400">{filtersOpen ? '▲' : '▼'}</span>
          </button>
          {filtersOpen && (
            <div className="px-4 py-3 border-t border-gray-200">
              <FilterPanel onApply={handleApplyFilters} onClearAll={handleClearFilters} />
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400">No Entries Available</p>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between px-4 py-3">
              <div className="space-y-0.5 min-w-0">
                {/* Clicking the notes/date navigates to the detail view */}
                <Link
                  to={`/entries/${entry.id}`}
                  className="block text-sm font-medium text-blue-700 hover:underline truncate"
                >
                  {entry.notes || dayjs(entry.date).format('MMM D, YYYY')}
                </Link>
                <p className="text-xs text-gray-500">
                  Author:{' '}
                  <Link to={`/users/${entry.authorId}/entries`} className="text-blue-600 hover:underline">
                    {entry.authorName}
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  Location:{' '}
                  <Link to={`/locations/${entry.locationId}/entries`} className="text-blue-600 hover:underline">
                    {entry.locationName}
                  </Link>
                </p>
                <p className="text-xs text-gray-500">Date: {dayjs(entry.date).format('MMM D, YYYY')}</p>
                <p className="text-xs text-gray-500">Catch Count: {entry.catchCount}</p>
              </div>

              {/* Delete button is only visible to the entry's author */}
              {currentUser && currentUser.id === entry.authorId && (
                <button
                  type="button"
                  onClick={() => handleDeleteClick(entry.id)}
                  className="ml-3 shrink-0 text-red-500 hover:text-red-700"
                  aria-label="Delete entry"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={confirmState.open}
        message="Are you sure you want to delete this report?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
