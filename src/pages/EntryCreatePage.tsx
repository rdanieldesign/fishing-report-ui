import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEntry } from '../api/entryApi';
import { getAllLocations } from '../api/locationApi';
import { FormShell } from '../components/shared/FormShell';
import { FileUpload } from '../components/shared/FileUpload';
import { LocationCreateModal } from '../components/locations/LocationCreateModal';
import type { IFileUpload } from '../types/fileUpload.types';

const DRAFT_KEY = 'fishing-report-draft';

interface EntryFormValues {
  notes: string;
  locationId: number | '';
  date: string;
  catchCount: number | '';
  images: IFileUpload[];
}

// Converts YYYY-MM-DD (from <input type="date">) to a midnight UTC datetime string.
function toUtcDateString(dateStr: string): string {
  return `${dateStr} 00:00:00`;
}

// Builds the multipart FormData payload.
// New images: file appended as 'images', filename pushed to imageNames (used as imageIds).
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
    }
  });
  fd.append('imageIds', JSON.stringify(imageNames));

  return fd;
}

export function EntryCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { data: locations = [], refetch: refetchLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });

  // Restore draft from localStorage (images are excluded from draft)
  const savedDraft = (() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
    } catch {
      return null;
    }
  })();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    defaultValues: savedDraft
      ? { ...savedDraft, images: [] }
      : { notes: '', locationId: '', date: '', catchCount: '', images: [] },
  });

  // Persist non-image fields to localStorage on every change
  const watchedValues = watch(['notes', 'locationId', 'date', 'catchCount']);
  useEffect(() => {
    const [notes, locationId, date, catchCount] = watchedValues;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ notes, locationId, date, catchCount }));
  }, [watchedValues]);

  const mutation = useMutation({
    mutationFn: createEntry,
    onSuccess: (reportId) => {
      localStorage.removeItem(DRAFT_KEY);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate(`/entries/${reportId}`);
    },
  });

  function onSubmit(data: EntryFormValues) {
    mutation.mutate(buildFormData(data));
  }

  function handleCancel() {
    localStorage.removeItem(DRAFT_KEY);
    navigate('/entries');
  }

  function handleLocationCreated(locationId: number) {
    refetchLocations();
    // Pre-select the newly created location in the form
    setValue('locationId', locationId);
  }

  return (
    <>
      <FormShell
        loading={false}
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
          {/* Controller wires FileUpload (uncontrolled DOM input) into RHF */}
          <Controller
            name="images"
            control={control}
            render={({ field }) => <FileUpload field={field} />}
          />
        </div>

        {mutation.isError && (
          <p className="text-xs text-red-600">Failed to create entry. Please try again.</p>
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
