import type { IWeatherConditions } from "../../types/entry.types";
import { WeatherThermometerBar } from "./WeatherThermometerBar";

const DOMAIN: [number, number] = [-20, 120];

interface Props {
  conditions: Pick<IWeatherConditions, "tempMin" | "tempMax" | "tempMean">;
}

export function TemperatureWidget({ conditions }: Props) {
  const { tempMin, tempMax, tempMean } = conditions;
  const ghost = Math.max(0, tempMin - DOMAIN[0]);
  const range = Math.max(0, tempMax - tempMin);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-gray-600">Temperature</span>
        <span className="text-xs text-gray-500">
          {tempMin}° – {tempMax}°F &middot; mean {tempMean}°F
        </span>
      </div>
      <WeatherThermometerBar
        segments={[
          { value: ghost, color: "transparent" },
          { value: range, color: "#f97316" },
        ]}
        domain={DOMAIN}
        leftLabel="-20°F"
        rightLabel="120°F"
        markerValue={tempMean}
      />
    </div>
  );
}
