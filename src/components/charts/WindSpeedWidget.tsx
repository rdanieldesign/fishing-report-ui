import type { IWeatherConditions } from "../../types/entry.types";
import { WeatherThermometerBar } from "./WeatherThermometerBar";

const DOMAIN: [number, number] = [0, 30];

interface Props {
  conditions: Pick<IWeatherConditions, "windSpeedMax">;
}

export function WindSpeedWidget({ conditions }: Props) {
  const { windSpeedMax } = conditions;
  // Cap at domain max for display; show actual value in label
  const displayValue = Math.min(windSpeedMax, DOMAIN[1]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-gray-600">
          Max Wind Speed
        </span>
        <span className="text-xs text-gray-500">{windSpeedMax} mph</span>
      </div>
      <WeatherThermometerBar
        segments={[{ value: displayValue, color: "#14b8a6" }]}
        domain={DOMAIN}
        leftLabel="0 mph"
        rightLabel="30 mph"
      />
    </div>
  );
}
