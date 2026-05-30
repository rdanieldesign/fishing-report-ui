import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { getAllLocations } from "../api/locationApi";
import { LocationCreateModal } from "../components/locations/LocationCreateModal";
import { Button } from "../components/shared/Button";
import type { ILocation } from "../types/location.types";

export function LocationListPage() {
  const queryClient = useQueryClient();
  const [editingLocation, setEditingLocation] = useState<ILocation | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading locations…</p>;
  }

  if (!locations?.length) {
    return <p className="text-gray-500 text-sm">No locations found.</p>;
  }

  function handleLocationSaved() {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="mb-0">Locations</h1>
        <Button onClick={() => setCreateOpen(true)}>Add Location</Button>
      </div>

      <LocationCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onLocationCreated={handleLocationSaved}
      />

      <LocationCreateModal
        isOpen={editingLocation !== null}
        onClose={() => setEditingLocation(null)}
        onLocationCreated={handleLocationSaved}
        location={editingLocation ?? undefined}
      />

      <ul className="space-y-2">
        {locations.map((location) => (
          <li
            key={location.id}
            className="border border-gray-200 border-l-primary border-l-6 bg-white rounded-lg overflow-hidden flex items-stretch"
          >
            <div className="flex-1 min-w-0 px-4 py-3 flex items-center">
              <span className="text-base font-medium text-gray-800">
                {location.name}
              </span>
            </div>
            <div className="shrink-0 bg-gray-900 flex items-center justify-center px-4">
              <button
                onClick={() => setEditingLocation(location)}
                className="text-gray-300 hover:text-gray-100 cursor-pointer"
                aria-label={`Edit ${location.name}`}
              >
                <Pencil size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
