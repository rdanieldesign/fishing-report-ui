import { Dialog } from "@headlessui/react";
import { LocationCreateForm } from "./LocationCreateForm";
import { DialogTitle } from "../shared/dialog/DialogTitle";
import type { ILocation } from "../../types/location.types";

interface LocationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the location's id after create or edit */
  onLocationCreated: (locationId: number) => void;
  /** When provided, the modal operates in edit mode */
  location?: ILocation;
}

// The parent controls open/close state and passes it as a prop; the Dialog
// handles focus trapping, ARIA role="dialog", and backdrop click-to-close.
export function LocationCreateModal({
  isOpen,
  onClose,
  onLocationCreated,
  location,
}: LocationCreateModalProps) {
  function handleSuccess(locationId: number) {
    onLocationCreated(locationId);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Centered panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <DialogTitle>
            {location ? "Edit Location" : "Create New Location"}
          </DialogTitle>

          <LocationCreateForm
            onSuccess={handleSuccess}
            onCancel={onClose}
            location={location}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
