import { Dialog } from '@headlessui/react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Replaces Angular's MatDialog-based ConfirmModalComponent. Angular opened it
// imperatively via dialog.open(); here the parent owns open/close state and
// passes it as a prop — the Dialog handles focus-trap and ARIA automatically.
export function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
          <Dialog.Title className="text-sm font-semibold text-gray-900 mb-4">
            Confirm
          </Dialog.Title>
          <p className="text-sm text-gray-700 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
