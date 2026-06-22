import { useRef, useState } from "react";
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
} from "../../api/entryApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { FilterPanel } from "./FilterPanel";
import { ReportCard } from "./ReportCard";
import { TopLocationWidget } from "../widgets/TopLocationWidget";
import { ConfirmModal } from "../shared/ConfirmModal";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import { formatFiltersAsText } from "../../utils/filterUtils";
import { FilterFieldParams, FilterFields } from "../../types/filter.types";
import type { IFilter } from "../../types/filter.types";
import type { IStringMap } from "../../types/generic.types";

const PAGE_LIMIT = 20;

interface EntryListProps {
  title: string;
  showFilters: boolean;
  fixedParams: { authorId?: number; locationId?: number };
}

export function EntryList({ title, showFilters, fixedParams }: EntryListProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const [appliedFilters, setAppliedFilters] = useState<IFilter[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    entryId: string;
  }>({ open: false, entryId: "" });

  const filterParams: IStringMap = appliedFilters.reduce(
    (acc, f) => ({
      ...acc,
      [FilterFieldParams[f.field.value as FilterFields]]:
        f.value.value.toString(),
    }),
    {} as IStringMap,
  );

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["entries", fixedParams, filterParams],
      queryFn: ({ pageParam }) =>
        getPaginatedReports(pageParam, {
          locationId:
            fixedParams.locationId ??
            (filterParams.locationId
              ? Number(filterParams.locationId)
              : undefined),
          authorId:
            fixedParams.authorId ??
            (filterParams.authorId ? Number(filterParams.authorId) : undefined),
          limit: PAGE_LIMIT,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage: IPaginatedReportsResponse) =>
        lastPage.nextCursor ?? undefined,
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
      <h1>{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
