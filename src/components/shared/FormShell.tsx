import type { ReactNode } from "react";
import { Button } from "./Button";

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
    <span className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  );
}

// Wraps form content in a flex-column container with a scrollable body area
// and bottom-aligned Cancel / Submit buttons.
export function FormShell({
  children,
  loading = false,
  submitDisabled = false,
  onSubmit,
  onCancel,
}: FormShellProps) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 space-y-4">{children}</div>

      {/* Bottom-aligned action buttons */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={submitDisabled}>
          Submit
        </Button>
      </div>
    </div>
  );
}
