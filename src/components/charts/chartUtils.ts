import type { IUsgsReading } from '../../types/entry.types';

export const TIME_SLOT_ORDER = [
  'midnight',
  'early_morning',
  'morning',
  'noon',
  'afternoon',
  'evening',
] as const;

export type TimeSlot = (typeof TIME_SLOT_ORDER)[number];

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  midnight: '12am',
  early_morning: '4am',
  morning: '8am',
  noon: '12pm',
  afternoon: '4pm',
  evening: '8pm',
};

export interface ChartDataPoint {
  timeSlot: string;
  label: string;
  value: number;
}

export interface ParameterGroup {
  parameterName: string;
  unit: string;
  data: ChartDataPoint[];
}

export function groupReadingsByParameter(
  readings: IUsgsReading[],
): ParameterGroup[] {
  const map = new Map<string, ParameterGroup>();

  for (const reading of readings) {
    if (!map.has(reading.parameterName)) {
      map.set(reading.parameterName, {
        parameterName: reading.parameterName,
        unit: reading.unit,
        data: [],
      });
    }
    map.get(reading.parameterName)!.data.push({
      timeSlot: reading.timeSlot,
      label: TIME_SLOT_LABELS[reading.timeSlot as TimeSlot] ?? reading.timeSlot,
      value: parseFloat(reading.value),
    });
  }

  for (const group of map.values()) {
    group.data.sort(
      (a, b) =>
        TIME_SLOT_ORDER.indexOf(a.timeSlot as TimeSlot) -
        TIME_SLOT_ORDER.indexOf(b.timeSlot as TimeSlot),
    );
  }

  return Array.from(map.values());
}
