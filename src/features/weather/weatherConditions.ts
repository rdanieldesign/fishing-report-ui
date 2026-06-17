import type { IWeatherConditions } from './weather.types';

export const WEATHER_LABELS: Record<
  keyof IWeatherConditions,
  { label: string; unit: string }
> = {
  tempMax: { label: 'High Temp', unit: '°F' },
  tempMin: { label: 'Low Temp', unit: '°F' },
  tempMean: { label: 'Mean Temp', unit: '°F' },
  precipitationSum: { label: 'Precipitation', unit: '"' },
  priorRainfall: { label: 'Prior Rainfall (Past 4 days)', unit: '"' },
  weatherCode: { label: 'Weather Code', unit: '' },
  windSpeedMax: { label: 'Max Wind Speed', unit: ' mph' },
  cloudCoverMin: { label: 'Min Cloud Cover', unit: '%' },
  cloudCoverMax: { label: 'Max Cloud Cover', unit: '%' },
  cloudCoverMean: { label: 'Mean Cloud Cover', unit: '%' },
};
