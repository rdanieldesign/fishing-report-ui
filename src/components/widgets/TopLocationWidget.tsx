import { useState } from "react";
import { Link } from "react-router-dom";
import type { ITopLocation } from "./topLocation.types";

interface TopLocationWidgetProps {
  topLocation: ITopLocation | null;
}

export function TopLocationWidget({ topLocation }: TopLocationWidgetProps) {
  const [open, setOpen] = useState(true);

  if (!topLocation) return null;

  return (
    <div className="bg-primary rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-3 hover:bg-primary-700"
      >
        <h6 className="text-white mb-0 mr-auto">Top Location</h6>
        <span className="text-white/70">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-6 pt-2 pb-6">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
            for this month
          </p>
          <Link to={`/locations/${topLocation.locationId}/entries`}>
            <h3 className="text-white hover:text-white/80 mb-0">
              {topLocation.locationName}
            </h3>
          </Link>
        </div>
      )}
    </div>
  );
}
