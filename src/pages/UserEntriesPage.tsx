import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/userApi";
import { EntryList } from "../components/entries/EntryList";

export function UserEntriesPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(Number(userId)),
    enabled: !!userId,
  });

  return (
    <EntryList
      title={user?.name ?? "…"}
      showFilters={false}
      fixedParams={{ authorId: Number(userId) }}
    />
  );
}
