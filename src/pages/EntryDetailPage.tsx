import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getEntry, deleteEntry } from '../api/entryApi';
import { getCurrentUser } from '../api/userApi';
import { useAuthStore } from '../stores/authStore';
import { FooterBreadcrumb } from '../components/shared/FooterBreadcrumb';
import { ConfirmModal } from '../components/shared/ConfirmModal';

export function EntryDetailPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', entryId],
    queryFn: () => getEntry(entryId!),
    enabled: !!entryId,
  });

  // Current user to gate edit/delete buttons
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEntry(entryId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate('/entries');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) return null;

  const isAuthor = currentUser?.id === entry.authorId;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-4 pb-4">
        {/* Narrative */}
        <p className="text-base text-gray-800">{entry.notes || 'No notes available'}</p>

        {/* Meta info */}
        <section className="space-y-1 text-sm text-gray-600">
          <div>
            Author:{' '}
            <Link to={`/users/${entry.authorId}/entries`} className="text-blue-600 hover:underline">
              {entry.authorName}
            </Link>
          </div>
          <div>
            Location:{' '}
            <Link to={`/locations/${entry.locationId}/entries`} className="text-blue-600 hover:underline">
              {entry.locationName}
            </Link>
          </div>
          <div>Date: {dayjs(entry.date).format('MMM D, YYYY')}</div>
          <div>Catch Count: {entry.catchCount}</div>
        </section>

        {/* Images */}
        {entry.images?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.images.map((img) => (
              <img
                key={img.imageId}
                src={img.imageURL}
                alt="Entry"
                className="w-40 h-40 object-cover rounded border border-gray-200"
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
              className="px-4 py-2 text-sm border border-blue-600 text-blue-700 rounded hover:bg-blue-50"
            >
              Edit Entry
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
