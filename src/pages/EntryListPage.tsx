import { useRef, useState } from "react";
import { useMatch } from "react-router-dom";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  getPaginatedReports,
  getTopLocation,
  deleteEntry,
  type IPaginatedReportsResponse,
} from "../api/entryApi";
import { getUserById, getCurrentUser } from "../api/userApi";
import { getLocationById } from "../api/locationApi";
import { useAuthStore } from "../stores/authStore";
import { FilterPanel } from "../components/entries/FilterPanel";
import { ReportCard } from "../components/entries/ReportCard";
import { TopLocationWidget } from "../components/widgets/TopLocationWidget";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { CollapsiblePanel } from "../components/shared/CollapsiblePanel";
import { formatFiltersAsText } from "../utils/filterUtils";
import { FilterFieldParams, FilterFields } from "../types/filter.types";
import type { IFilter } from "../types/filter.types";
import type { IStringMap } from "../types/generic.types";

const PAGE_LIMIT = 20;

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
    isMyEntries && currentUser
      ? { authorId: String(currentUser.id) }
      : isUserView && userId
        ? { authorId: userId }
        : isLocationView && locationId
          ? { locationId }
          : {};

  const queryParams = { ...urlParams, ...filterParams };

  const variantKey = isMyEntries
    ? "mine"
    : isUserView
      ? "user"
      : isLocationView
        ? "location"
        : "all";

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["entries", variantKey, queryParams],
      queryFn: ({ pageParam }) =>
        getPaginatedReports(pageParam, {
          locationId: queryParams.locationId
            ? Number(queryParams.locationId)
            : undefined,
          authorId: queryParams.authorId
            ? Number(queryParams.authorId)
            : undefined,
          limit: PAGE_LIMIT,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage: IPaginatedReportsResponse) =>
        lastPage.nextCursor ?? undefined,
      enabled: !isMyEntries || !!currentUser,
    });

  const allEntries = data?.pages.flatMap((page) => page.reports) ?? [];

  const { data: topLocation } = useQuery({
    queryKey: ["topLocation"],
    queryFn: getTopLocation,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const listRef = useRef<HTMLUListElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? allEntries.length + 1 : allEntries.length,
    estimateSize: () => 180,
    overscan: 4,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    onChange: (instance) => {
      const virtualItems = instance.getVirtualItems();
      const last = virtualItems[virtualItems.length - 1];
      if (!last) return;
      if (
        last.index >= allEntries.length &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
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
            <CollapsiblePanel
              title="Filters"
              theme="black"
              summary={
                appliedFilters.length > 0 ? (
                  <span className="text-xs text-gray-200 font-normal mr-4">
                    {formatFiltersAsText(appliedFilters)}
                  </span>
                ) : undefined
              }
            >
              <FilterPanel
                onApply={handleApplyFilters}
                onClearAll={handleClearFilters}
              />
            </CollapsiblePanel>
            <div className="mt-4">
              <TopLocationWidget topLocation={topLocation ?? null} />
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
          ) : allEntries.length === 0 ? (
            <p className="text-sm text-gray-400">No Entries Available</p>
          ) : (
            <ul
              ref={listRef}
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoader = virtualRow.index >= allEntries.length;
                const entry = allEntries[virtualRow.index];

                return (
                  <li
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    {isLoader ? (
                      <div className="flex justify-center py-6">
                        <span className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="pb-4">
                        <ReportCard
                          report={entry}
                          handleDelete={
                            currentUser && currentUser.id === entry.authorId
                              ? handleDeleteClick
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </li>
                );
              })}
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
