import type { IWeatherConditions } from "../../types/entry.types";
import { WeatherThermometerBar } from "./WeatherThermometerBar";

const SCALE_MAX = 10;
const DOMAIN: [number, number] = [0, SCALE_MAX];

interface Props {
  conditions: Pick<IWeatherConditions, "precipitationSum" | "priorRainfall">;
}

export function PrecipitationWidget({ conditions }: Props) {
  const { priorRainfall, precipitationSum } = conditions;
  const total = priorRainfall + precipitationSum;

  // Scale to fit within SCALE_MAX when total overflows
  const scale = total > SCALE_MAX ? SCALE_MAX / total : 1;
  const priorSeg = priorRainfall * scale;
  const currentSeg = precipitationSum * scale;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-gray-600">Precipitation</span>
        <span className="text-xs text-gray-500">
          <span className="text-sky-400">{priorRainfall}"</span> prior /{" "}
          <span className="text-blue-600">{precipitationSum}"</span> today
        </span>
      </div>
      <WeatherThermometerBar
        segments={[
          { value: priorSeg, color: "#7dd3fc" },
          { value: currentSeg, color: "#2563eb" },
        ]}
        domain={DOMAIN}
        leftLabel='0"'
        rightLabel={total > SCALE_MAX ? `${total.toFixed(1)}"` : '10"'}
      />
    </div>
  );
}
