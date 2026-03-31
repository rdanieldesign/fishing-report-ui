import type { ReactNode } from 'react';

interface FormShellProps {
  children: ReactNode;
  loading?: boolean;
  submitDisabled?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

// Spinner using a CSS border-trick — avoids importing an icon library.
function Spinner() {
  return (
    <span className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  );
}

// Wraps form content in a flex-column container with a scrollable body area
// and bottom-aligned Cancel / Submit buttons.
export function FormShell({ children, loading = false, submitDisabled = false, onSubmit, onCancel }: FormShellProps) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {children}
      </div>

      {/* Bottom-aligned action buttons */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitDisabled}
          className="px-4 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
