import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { deleteEntry, fetchUsgsReadings, getEntry } from "../api/entryApi";
import type { IUsgsReading, IReportImage } from "../types/entry.types";
import { getCurrentUser } from "../api/userApi";
import { useAuthStore } from "../stores/authStore";
import { FooterBreadcrumb } from "../components/shared/FooterBreadcrumb";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { EntryImage } from "../components/shared/EntryImage";

export function EntryDetailPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ["entry", entryId],
    queryFn: () => getEntry(Number(entryId)),
    enabled: !!entryId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.images?.some((img) => img.status === "uploading")) {
        return 3000; // Refetch every 3 seconds while images are uploading
      }
      return false; // Don't refetch if no images are uploading
    },
  });

  // Current user to gate edit/delete buttons
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEntry(entryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      navigate("/entries");
    },
  });

  const [usgsLoading, setUsgsLoading] = useState(false);

  async function handleLoadUsgs() {
    if (!entry?.usgsLocationId) return;
    try {
      await fetchUsgsReadings(entryId!, entry.usgsLocationId, entry.date);
      setUsgsLoading(true);
    } catch {
      // leave button enabled so the user can retry
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) return null;

  const isAuthor = currentUser?.id === entry.authorId;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-4 pb-4">
        {/* Narrative */}
        <p className="text-500 text-gray-800">
          {entry.notes || "No notes available"}
        </p>

        {/* Meta info */}
        <section className="space-y-1 text-sm text-gray-600">
          <div>
            Author:{" "}
            <Link
              to={`/users/${entry.authorId}/entries`}
              className="text-primary-500 hover:underline"
            >
              {entry.authorName}
            </Link>
          </div>
          <div>
            Location:{" "}
            <Link
              to={`/locations/${entry.locationId}/entries`}
              className="text-primary-500 hover:underline"
            >
              {entry.locationName}
            </Link>
          </div>
          <div>Date: {dayjs(entry.date).format("MMM D, YYYY")}</div>
          <div>Catch Count: {entry.catchCount}</div>
        </section>

        {/* USGS Readings */}
        {entry.usgsLocationId && (
          <section aria-label="USGS stream readings" className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              USGS Stream Data
            </h2>
            {entry.usgsReadings && entry.usgsReadings.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-700">
                {entry.usgsReadings.map((reading: IUsgsReading) => (
                  <li key={reading.id}>
                    {reading.parameterName}: {reading.value}
                    {reading.unit}
                  </li>
                ))}
              </ul>
            ) : (
              <button
                type="button"
                onClick={handleLoadUsgs}
                disabled={usgsLoading}
                className="px-3 py-1.5 text-sm border border-blue-600 text-blue-700 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {usgsLoading ? "Loading..." : "Load data"}
              </button>
            )}
          </section>
        )}

        {/* Images */}
        {entry.images?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.images.map((img: IReportImage) => (
              <EntryImage
                key={img.id}
                imageURL={img.imageURL}
                status={img.status}
              />
            ))}
          </div>
        )}

        {/* Author-gated actions */}
        {isAuthor && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/entries/${entryId}/edit`)}
              className="px-4 py-2 text-sm border border-primary-500 text-primary-500 rounded hover:bg-blue-50"
            >
              Edit Entry
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 text-sm bg-danger text-white rounded hover:bg-danger-dark"
            >
              Delete Entry
            </button>
          </div>
        )}
      </div>

      <FooterBreadcrumb text="Reports" to="/entries" />

      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this report?"
        onConfirm={() => {
          setConfirmOpen(false);
          deleteMutation.mutate();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
