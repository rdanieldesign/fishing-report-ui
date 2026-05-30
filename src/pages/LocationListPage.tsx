import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { getAllLocations } from "../api/locationApi";
import { LocationCreateModal } from "../components/locations/LocationCreateModal";
import { Button } from "../components/shared/Button";

export function LocationListPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

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

  function handleLocationCreated() {
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    setModalOpen(false);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="mb-0">Locations</h1>
        <Button onClick={() => setModalOpen(true)}>Add Location</Button>
      </div>

      <LocationCreateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLocationCreated={handleLocationCreated}
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
              <Link
                to={`/locations/${location.id}/edit`}
                className="text-gray-300 hover:text-gray-100"
                aria-label={`Edit ${location.name}`}
              >
                <Pencil size={18} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
