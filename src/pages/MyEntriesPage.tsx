import { useCurrentUser } from "../hooks/useCurrentUser";
import { EntryList } from "../components/entries/EntryList";

export function MyEntriesPage() {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) return null;

  return (
    <EntryList
      title="My Reports"
      showFilters
      fixedParams={{ authorId: currentUser.id }}
    />
  );
}
