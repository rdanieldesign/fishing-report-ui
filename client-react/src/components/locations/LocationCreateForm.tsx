import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createLocation } from '../../api/locationApi';
import type { INewLocation } from '../../types/location.types';

interface LocationCreateFormProps {
  /** Called with the new location's id after successful creation */
  onSuccess: (locationId: number) => void;
  onCancel: () => void;
}

export function LocationCreateForm({ onSuccess, onCancel }: LocationCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<INewLocation>();

  const mutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (id) => onSuccess(id),
  });

  function onSubmit(data: INewLocation) {
    mutation.mutate(data);
  }

  return (
    // handleSubmit validates then calls onSubmit; no need for a separate button onClick
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Lake Trout Pond"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Maps Link
        </label>
        <input
          {...register('googleMapsLink', { required: 'Google Maps link is required' })}
          type="url"
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="https://maps.google.com/..."
        />
        {errors.googleMapsLink && (
          <p className="text-xs text-red-600 mt-1">{errors.googleMapsLink.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-xs text-red-600">Failed to create location. Please try again.</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  );
}
