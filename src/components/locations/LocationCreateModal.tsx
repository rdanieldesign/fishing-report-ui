import { Dialog } from "@headlessui/react";
import { LocationCreateForm } from "./LocationCreateForm";
import { DialogTitle } from "../shared/dialog/DialogTitle";

interface LocationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the new location's id so the parent can select it in the entry form */
  onLocationCreated: (locationId: number) => void;
}

// The parent controls open/close state and passes it as a prop; the Dialog
// handles focus trapping, ARIA role="dialog", and backdrop click-to-close.
export function LocationCreateModal({
  isOpen,
  onClose,
  onLocationCreated,
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
          <DialogTitle>Create New Location</DialogTitle>

          <LocationCreateForm onSuccess={handleSuccess} onCancel={onClose} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
