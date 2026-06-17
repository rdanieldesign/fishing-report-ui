import type { IWeatherConditions } from "../weather.types";
import { WeatherThermometerBar } from "./WeatherThermometerBar";

const DOMAIN: [number, number] = [0, 100];

interface Props {
  conditions: Pick<
    IWeatherConditions,
    "cloudCoverMin" | "cloudCoverMax" | "cloudCoverMean"
  >;
}

export function CloudCoverWidget({ conditions }: Props) {
  const { cloudCoverMin, cloudCoverMax, cloudCoverMean } = conditions;
  const ghost = Math.max(0, cloudCoverMin);
  const range = Math.max(0, cloudCoverMax - cloudCoverMin);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-gray-600">Cloud Cover</span>
        <span className="text-xs text-gray-500">
          {cloudCoverMin}% – {cloudCoverMax}% &middot; average {cloudCoverMean}%
        </span>
      </div>
      <WeatherThermometerBar
        segments={[
          { value: ghost, color: "transparent" },
          { value: range, color: "#94a3b8" },
        ]}
        domain={DOMAIN}
        leftLabel="0%"
        rightLabel="100%"
        markerValue={cloudCoverMean}
      />
    </div>
  );
}
