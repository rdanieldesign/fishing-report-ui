import { Dialog } from "@headlessui/react";
import { Button } from "./Button";
import { DialogTitle } from "./dialog/DialogTitle";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// The parent owns open/close state and passes it as a prop;
// the Dialog handles focus-trap and ARIA automatically.
export function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
          <DialogTitle>Confirm</DialogTitle>
          <p className="text-sm text-gray-700 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
