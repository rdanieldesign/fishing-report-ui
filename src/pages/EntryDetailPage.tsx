import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { deleteEntry, getEntry } from "../api/entryApi";
import type { IReportImage } from "../types/entry.types";
import { UsgsReadingsSection } from "../components/charts/UsgsReadingsSection";
import { WeatherConditionsSection } from "../features/weather/components/WeatherConditionsSection";
import { getCurrentUser } from "../api/userApi";
import { useAuthStore } from "../stores/authStore";
import { CollapsiblePanel } from "../components/shared/CollapsiblePanel";
import { FooterBreadcrumb } from "../components/shared/FooterBreadcrumb";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { EntryImage } from "../components/shared/EntryImage";
import { Button } from "../components/shared/Button";
import { MapPin } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) return null;

  const isAuthor = currentUser?.id === entry.authorId;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 grid grid-cols-12 gap-4 pb-4 content-start">
        <h1 className="col-span-12 mb-2">
          {dayjs(entry.date).format("MMM D, YYYY")}
        </h1>
        <Link
          to={`/locations/${entry.locationId}/entries`}
          className="col-span-12 text-primary hover:underline block"
        >
          <MapPin className="inline mx-1 ml-0 mb-0.5 text-primary" size={18} />
          <span className="text-base">{entry.locationName}</span>
        </Link>

        {/* Narrative */}
        <p className="col-span-12 text-500 text-gray-800">
          {entry.notes || "No notes available"}
        </p>

        {/* Meta info */}
        <section className="col-span-12 space-y-1 text-gray-600">
          <div>
            <label>Author: </label>
            <Link
              to={`/users/${entry.authorId}/entries`}
              className="text-primary hover:underline"
            >
              {entry.authorName}
            </Link>
          </div>
          <div>Catch Count: {entry.catchCount}</div>
        </section>

        {/* Images */}
        {entry.images?.length > 0 && (
          <div className="col-span-12 flex flex-wrap gap-2">
            {entry.images.map((img: IReportImage) => (
              <EntryImage
                key={img.id}
                imageURL={img.imageURL}
                status={img.status}
              />
            ))}
          </div>
        )}

        {/* USGS Readings */}
        {entry.usgsReadings && entry.usgsReadings.length > 0 && (
          <div className="col-span-12 md:col-span-6">
            <CollapsiblePanel title="USGS Stream Data" theme="white">
              <UsgsReadingsSection readings={entry.usgsReadings} />
            </CollapsiblePanel>
          </div>
        )}

        {/* Weather Conditions */}
        {entry.weatherConditions && (
          <div className="col-span-12 md:col-span-6">
            <CollapsiblePanel title="Weather Conditions" theme="white">
              <WeatherConditionsSection conditions={entry.weatherConditions} />
            </CollapsiblePanel>
          </div>
        )}

        {/* Author-gated actions */}
        {isAuthor && (
          <div className="col-span-12 flex gap-3 pt-2">
            <Button variant="secondary" link={`/entries/${entryId}/edit`}>
              Edit Entry
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete Entry
            </Button>
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
