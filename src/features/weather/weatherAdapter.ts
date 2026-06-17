import type { IWeatherConditions } from './weather.types';

export function adaptWeatherConditions(
  raw: IWeatherConditions,
): IWeatherConditions {
  return {
    tempMax: Math.round(raw.tempMax),
    tempMin: Math.round(raw.tempMin),
    tempMean: Math.round(raw.tempMean),
    cloudCoverMin: Math.round(raw.cloudCoverMin),
    cloudCoverMax: Math.round(raw.cloudCoverMax),
    cloudCoverMean: Math.round(raw.cloudCoverMean),
    precipitationSum: Math.round(raw.precipitationSum * 100) / 100,
    priorRainfall: Math.round(raw.priorRainfall * 100) / 100,
    weatherCode: raw.weatherCode,
    windSpeedMax: Math.round(raw.windSpeedMax),
  };
}
