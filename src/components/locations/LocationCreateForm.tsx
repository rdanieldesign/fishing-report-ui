import { useForm } from "react-hook-form";
import { Button } from "../shared/Button";
import { useMutation } from "@tanstack/react-query";
import { createLocation, updateLocation } from "../../api/locationApi";
import type { ILocation, INewLocation } from "../../types/location.types";

interface LocationFormValues {
  name: string;
  latitude: string;
  longitude: string;
  usgsLocationId?: string;
}

interface LocationCreateFormProps {
  /** Called with the new location's id after successful creation */
  onSuccess: (locationId: number) => void;
  onCancel: () => void;
  /** When provided, the form operates in edit mode */
  location?: ILocation;
}

export function LocationCreateForm({
  onSuccess,
  onCancel,
  location,
}: LocationCreateFormProps) {
  const isEditing = location !== undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    defaultValues: location
      ? {
          name: location.name,
          latitude: location.coordinates
            ? String(location.coordinates?.latitude)
            : "",
          longitude: location.coordinates
            ? String(location.coordinates?.longitude)
            : "",
          usgsLocationId: location.usgsLocationId ?? undefined,
        }
      : undefined,
  });

  const createMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (id) => onSuccess(id),
  });

  const updateMutation = useMutation({
    mutationFn: (data: INewLocation) => updateLocation(location!.id, data),
    onSuccess: () => onSuccess(location!.id),
  });

  const mutation = isEditing ? updateMutation : createMutation;

  function onSubmit(values: LocationFormValues) {
    const payload: INewLocation = {
      name: values.name,
      coordinates: {
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      },
      usgsLocationId: values.usgsLocationId || null,
    };
    mutation.mutate(payload);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          className="w-full"
          placeholder="e.g. Lake Trout Pond"
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            {...register("latitude", {
              required: "Latitude is required",
              validate: (v) =>
                (!isNaN(parseFloat(v)) && isFinite(Number(v))) ||
                "Enter a valid number",
            })}
            type="text"
            inputMode="decimal"
            className="w-full"
            placeholder="e.g. 34.0194"
          />
          {errors.latitude && (
            <p className="text-xs text-danger mt-1">
              {errors.latitude.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            {...register("longitude", {
              required: "Longitude is required",
              validate: (v) =>
                (!isNaN(parseFloat(v)) && isFinite(Number(v))) ||
                "Enter a valid number",
            })}
            type="text"
            inputMode="decimal"
            className="w-full"
            placeholder="e.g. -84.3725"
          />
          {errors.longitude && (
            <p className="text-xs text-danger mt-1">
              {errors.longitude.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          USGS Location ID{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          {...register("usgsLocationId")}
          type="text"
          className="w-full"
          placeholder="e.g. USGS-02335757"
        />
      </div>

      {mutation.isError && (
        <p className="text-xs text-danger">
          {isEditing
            ? "Failed to update location. Please try again."
            : "Failed to create location. Please try again."}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending
            ? isEditing
              ? "Saving…"
              : "Creating…"
            : isEditing
              ? "Save"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}
