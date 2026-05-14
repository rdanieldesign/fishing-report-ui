import { useState } from "react";
import { useMatch } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllEntries, getMyEntries, deleteEntry } from "../api/entryApi";
import { getUserById, getCurrentUser } from "../api/userApi";
import { getLocationById } from "../api/locationApi";
import { useAuthStore } from "../stores/authStore";
import { FilterPanel } from "../components/entries/FilterPanel";
import { ReportCard } from "../components/entries/ReportCard";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { formatFiltersAsText } from "../utils/filterUtils";
import { FilterFieldParams, FilterFields } from "../types/filter.types";
import type { IFilter } from "../types/filter.types";
import type { IStringMap } from "../types/generic.types";

// This component serves four routes by detecting which URL pattern is active.
export function EntryListPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  // Detect which route variant is active
  const userMatch = useMatch("/users/:userId/entries");
  const locationMatch = useMatch("/locations/:locationId/entries");
  const myEntriesMatch = useMatch("/my-entries");

  const isUserView = !!userMatch;
  const isLocationView = !!locationMatch;
  const isMyEntries = !!myEntriesMatch;

  const userId = userMatch?.params.userId;
  const locationId = locationMatch?.params.locationId;

  // Applied filters from FilterPanel (only relevant for /entries and /my-entries)
  const [appliedFilters, setAppliedFilters] = useState<IFilter[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Confirm-delete modal state — lifted here so deleteEntry can trigger it imperatively
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    entryId: string;
  }>({ open: false, entryId: "" });

  // Optional header-data queries — enabled only for the relevant route
  const { data: headerUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(Number(userId)),
    enabled: isUserView && !!userId,
  });

  const { data: headerLocation } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => getLocationById(Number(locationId)),
    enabled: isLocationView && !!locationId,
  });

  // Current user — needed to gate the delete button on authorId
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
  });

  // Build the params object that goes to the API
  // Cast field.value to FilterFields so TypeScript can index the const record
  const filterParams: IStringMap = appliedFilters.reduce(
    (acc, f) => ({
      ...acc,
      [FilterFieldParams[f.field.value as FilterFields]]:
        f.value.value.toString(),
    }),
    {} as IStringMap,
  );

  const urlParams: IStringMap =
    isUserView && userId
      ? { authorId: userId }
      : isLocationView && locationId
        ? { locationId }
        : {};

  const queryParams = { ...urlParams, ...filterParams };

  // Single entries query; queryKey includes queryParams so React Query refetches
  // when filters or URL params change.
  const { data: entries = [], isLoading } = useQuery({
    queryKey: [
      "entries",
      isMyEntries
        ? "mine"
        : isUserView
          ? "user"
          : isLocationView
            ? "location"
            : "all",
      queryParams,
    ],
    queryFn: () =>
      isMyEntries ? getMyEntries(queryParams) : getAllEntries(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      // Invalidate the currently active entries query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  // Determine display config from route
  const pageHeader = isUserView
    ? (headerUser?.name ?? "…")
    : isLocationView
      ? (headerLocation?.name ?? "…")
      : isMyEntries
        ? "My Reports"
        : "All Reports";

  const showFilters = !isUserView && !isLocationView;

  function handleApplyFilters(filters: IFilter[]) {
    setAppliedFilters(filters);
  }

  function handleClearFilters() {
    setAppliedFilters([]);
  }

  function handleDeleteClick(id: string) {
    setConfirmState({ open: true, entryId: id });
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(confirmState.entryId);
    setConfirmState({ open: false, entryId: "" });
  }

  function handleCancelDelete() {
    setConfirmState({ open: false, entryId: "" });
  }

  return (
    <div className="space-y-4">
      <h1>{pageHeader}</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters — full width on mobile (top), right 4 cols on desktop */}
        {showFilters && (
          <aside className="md:col-start-9 md:col-span-4 md:row-start-1">
            <div className="bg-gray-900 rounded-lg">
              {/* Mobile filters */}
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 rounded-lg"
              >
                <h6 className="text-gray-100 mb-0 mr-auto">Filters</h6>
                {!filtersOpen && appliedFilters.length > 0 && (
                  <span className="text-xs text-gray-200 font-normal mr-4">
                    {formatFiltersAsText(appliedFilters)}
                  </span>
                )}
                <span className="text-gray-400">{filtersOpen ? "▲" : "▼"}</span>
              </button>

              <div className={`px-4 py-3 ${filtersOpen ? "block" : "hidden"}`}>
                <FilterPanel
                  onApply={handleApplyFilters}
                  onClearAll={handleClearFilters}
                />
              </div>
            </div>
          </aside>
        )}

        {/* Report list — full width on mobile, left 8 cols on desktop */}
        <div
          className={
            showFilters
              ? "md:col-start-1 md:col-span-8 md:row-start-1"
              : "md:col-span-12"
          }
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-400">No Entries Available</p>
          ) : (
            <ul className="space-y-4">
              {entries.map((entry) => (
                <ReportCard
                  key={entry.id}
                  report={entry}
                  handleDelete={
                    currentUser && currentUser.id === entry.authorId
                      ? handleDeleteClick
                      : undefined
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmState.open}
        message="Are you sure you want to delete this report?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
