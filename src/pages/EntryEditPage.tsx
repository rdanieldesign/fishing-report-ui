import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getEntry, editEntry } from '../api/entryApi';
import { getAllLocations } from '../api/locationApi';
import { FormShell } from '../components/shared/FormShell';
import { FileUpload } from '../components/shared/FileUpload';
import { LocationCreateModal } from '../components/locations/LocationCreateModal';
import type { IFileUpload } from '../types/fileUpload.types';

interface EntryFormValues {
  notes: string;
  locationId: number | '';
  date: string;
  catchCount: number | '';
  images: IFileUpload[];
}

function toUtcDateString(dateStr: string): string {
  return `${dateStr} 00:00:00`;
}

// Edit FormData differs from create: existing images contribute only their imageId
// to the imageIds array (not re-uploaded); new files are appended as 'images'.
// This matches Angular's editEntry FormData builder exactly.
function buildFormData(values: EntryFormValues): FormData {
  const fd = new FormData();
  fd.append('notes', values.notes);
  fd.append('locationId', String(values.locationId));
  fd.append('date', toUtcDateString(values.date));
  fd.append('catchCount', String(values.catchCount));

  const imageNames: string[] = [];
  (values.images ?? []).forEach((img) => {
    if (img.newFile) {
      fd.append('images', img.newFile);
      imageNames.push(img.newFile.name);
    } else if (img.imageId) {
      // Existing server image — include its ID so the backend keeps it
      imageNames.push(img.imageId);
    }
  });
  fd.append('imageIds', JSON.stringify(imageNames));

  return fd;
}

export function EntryEditPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Load locations and the existing entry in parallel — mirrors Angular's forkJoin
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });

  const { data: entry, isLoading: entryLoading } = useQuery({
    queryKey: ['entry', entryId],
    queryFn: () => getEntry(entryId!),
    enabled: !!entryId,
  });

  // Form is only initialised once the entry is loaded; `entry` drives defaultValues.
  // Angular built the FormGroup inside the forkJoin subscribe — same timing here.
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    // entry?.date comes as a full datetime string; slice to YYYY-MM-DD for <input type="date">
    defaultValues: entry
      ? {
          notes: entry.notes,
          locationId: entry.locationId,
          date: dayjs(entry.date).format('YYYY-MM-DD'),
          catchCount: entry.catchCount,
          // Map IReportImage[] → IFileUpload[] so FileUpload can render existing images
          images: entry.images?.map((img) => ({
            imageURL: img.imageURL,
            imageId: img.imageId,
          })),
        }
      : undefined,
    // Re-run defaultValues when entry data arrives
    values: entry
      ? {
          notes: entry.notes,
          locationId: entry.locationId,
          date: dayjs(entry.date).format('YYYY-MM-DD'),
          catchCount: entry.catchCount,
          images: entry.images?.map((img) => ({
            imageURL: img.imageURL,
            imageId: img.imageId,
          })),
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (fd: FormData) => editEntry(entryId!, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry', entryId] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate(`/entries/${entryId}`);
    },
  });

  function onSubmit(data: EntryFormValues) {
    mutation.mutate(buildFormData(data));
  }

  function handleCancel() {
    navigate(`/entries/${entryId}`);
  }

  function handleLocationCreated(locationId: number) {
    queryClient.invalidateQueries({ queryKey: ['locations'] });
    setValue('locationId', locationId);
  }

  return (
    <>
      <FormShell
        loading={entryLoading}
        submitDisabled={isSubmitting || mutation.isPending}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            {...register('notes', { required: 'Notes are required' })}
            rows={4}
            placeholder="Add Narrative Here"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            {...register('locationId', { required: 'Location is required' })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {errors.locationId && (
            <p className="text-xs text-red-600 mt-1">{errors.locationId.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            (or{' '}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="text-blue-600 hover:underline"
            >
              add a new location
            </button>
            )
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            {...register('date', { required: 'Date is required' })}
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catch Count</label>
          <input
            {...register('catchCount', { required: 'Catch count is required', min: 0 })}
            type="number"
            min={0}
            placeholder="How many fish did you catch?"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.catchCount && (
            <p className="text-xs text-red-600 mt-1">{errors.catchCount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <Controller
            name="images"
            control={control}
            render={({ field }) => <FileUpload field={field} />}
          />
        </div>

        {mutation.isError && (
          <p className="text-xs text-red-600">Failed to save entry. Please try again.</p>
        )}
      </FormShell>

      <LocationCreateModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onLocationCreated={handleLocationCreated}
      />
    </>
  );
}
