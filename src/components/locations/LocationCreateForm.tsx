import { useForm } from "react-hook-form";
import { Button } from "../shared/Button";
import { useMutation } from "@tanstack/react-query";
import { createLocation } from "../../api/locationApi";
import type { INewLocation } from "../../types/location.types";

interface LocationCreateFormProps {
  /** Called with the new location's id after successful creation */
  onSuccess: (locationId: number) => void;
  onCancel: () => void;
}

export function LocationCreateForm({
  onSuccess,
  onCancel,
}: LocationCreateFormProps) {
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
          {...register("name", { required: "Name is required" })}
          type="text"
          className="w-full"
          placeholder="e.g. Lake Trout Pond"
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Maps Link
        </label>
        <input
          {...register("googleMapsLink", {
            required: "Google Maps link is required",
          })}
          type="url"
          className="w-full"
          placeholder="https://maps.google.com/..."
        />
        {errors.googleMapsLink && (
          <p className="text-xs text-danger mt-1">
            {errors.googleMapsLink.message}
          </p>
        )}
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
          Failed to create location. Please try again.
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Create"}
        </Button>
      </div>
    </form>
  );
}
