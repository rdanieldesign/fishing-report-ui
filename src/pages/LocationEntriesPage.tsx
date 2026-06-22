import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLocationById } from "../api/locationApi";
import { EntryList } from "../components/entries/EntryList";

export function LocationEntriesPage() {
  const { locationId } = useParams<{ locationId: string }>();

  const { data: location } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => getLocationById(Number(locationId)),
    enabled: !!locationId,
  });

  return (
    <EntryList
      title={location?.name ?? "…"}
      showFilters={false}
      fixedParams={{ locationId: Number(locationId) }}
    />
  );
}
