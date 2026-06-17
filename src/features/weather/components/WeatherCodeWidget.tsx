import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import type { IWeatherConditions } from "../weather.types";

interface CodeInfo {
  label: string;
  Icon: LucideIcon;
}

const WMO_CODES: Record<number, CodeInfo> = {
  0: { label: "Clear sky", Icon: Sun },
  1: { label: "Mainly clear", Icon: Sun },
  2: { label: "Partly cloudy", Icon: Cloud },
  3: { label: "Overcast", Icon: Cloud },
  45: { label: "Foggy", Icon: Wind },
  48: { label: "Icy fog", Icon: Wind },
  51: { label: "Light drizzle", Icon: CloudDrizzle },
  53: { label: "Moderate drizzle", Icon: CloudDrizzle },
  55: { label: "Dense drizzle", Icon: CloudDrizzle },
  56: { label: "Light freezing drizzle", Icon: CloudDrizzle },
  57: { label: "Heavy freezing drizzle", Icon: CloudDrizzle },
  61: { label: "Slight rain", Icon: CloudRain },
  63: { label: "Moderate rain", Icon: CloudRain },
  65: { label: "Heavy rain", Icon: CloudRain },
  66: { label: "Light freezing rain", Icon: CloudRain },
  67: { label: "Heavy freezing rain", Icon: CloudRain },
  71: { label: "Slight snow", Icon: CloudSnow },
  73: { label: "Moderate snow", Icon: CloudSnow },
  75: { label: "Heavy snow", Icon: CloudSnow },
  77: { label: "Snow grains", Icon: Snowflake },
  80: { label: "Slight rain showers", Icon: CloudRain },
  81: { label: "Moderate rain showers", Icon: CloudRain },
  82: { label: "Violent rain showers", Icon: CloudRain },
  85: { label: "Slight snow showers", Icon: CloudSnow },
  86: { label: "Heavy snow showers", Icon: CloudSnow },
  95: { label: "Thunderstorm", Icon: CloudLightning },
  96: { label: "Thunderstorm with hail", Icon: CloudLightning },
  99: { label: "Thunderstorm with heavy hail", Icon: CloudLightning },
};

interface Props {
  conditions: Pick<IWeatherConditions, "weatherCode">;
}

export function WeatherCodeWidget({ conditions }: Props) {
  const { weatherCode } = conditions;
  const info = WMO_CODES[weatherCode] ?? {
    label: `Code ${weatherCode}`,
    Icon: Cloud,
  };
  const { label, Icon } = info;

  return (
    <div className="flex items-center gap-2">
      <Icon size={20} className="text-gray-500 shrink-0" aria-hidden />
      <div>
        <span className="text-xs font-medium text-gray-600">Conditions</span>
        <p className="text-sm text-gray-800 leading-tight">{label}</p>
      </div>
    </div>
  );
}
