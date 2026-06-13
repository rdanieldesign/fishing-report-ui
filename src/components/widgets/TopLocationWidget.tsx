import { Link } from "react-router-dom";
import { CollapsiblePanel } from "../shared/CollapsiblePanel";
import type { ITopLocation } from "./topLocation.types";

interface TopLocationWidgetProps {
  topLocation: ITopLocation | null;
}

export function TopLocationWidget({ topLocation }: TopLocationWidgetProps) {
  if (!topLocation) return null;

  return (
    <CollapsiblePanel title="Top Location" theme="primary">
      <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
        for this month
      </p>
      <Link to={`/locations/${topLocation.locationId}/entries`}>
        <h3 className="text-white hover:text-white/80 mb-0">
          {topLocation.locationName}
        </h3>
      </Link>
    </CollapsiblePanel>
  );
}
