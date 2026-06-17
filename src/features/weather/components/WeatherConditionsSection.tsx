import type { IWeatherConditions } from "../weather.types";
import { TemperatureWidget } from "./TemperatureWidget";
import { CloudCoverWidget } from "./CloudCoverWidget";
import { PrecipitationWidget } from "./PrecipitationWidget";
import { WindSpeedWidget } from "./WindSpeedWidget";
import { WeatherCodeWidget } from "./WeatherCodeWidget";

interface Props {
  conditions: IWeatherConditions;
}

export function WeatherConditionsSection({ conditions }: Props) {
  return (
    <section aria-label="Weather conditions" className="space-y-4">
      <WeatherCodeWidget conditions={conditions} />
      <TemperatureWidget conditions={conditions} />
      <CloudCoverWidget conditions={conditions} />
      <PrecipitationWidget conditions={conditions} />
      <WindSpeedWidget conditions={conditions} />
    </section>
  );
}
