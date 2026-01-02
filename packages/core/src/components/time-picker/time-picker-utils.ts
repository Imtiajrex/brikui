import type { TimeParts, TimeValue } from './time-picker.types';

export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const clampToRange = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export const parseTimeValue = (value?: TimeValue): TimeParts => {
  if (!value) return { hours: 0, minutes: 0 };
  const [rawHours, rawMinutes = '0'] = value.split(':');
  const hoursNum = Number.parseInt(rawHours, 10);
  const minutesNum = Number.parseInt(rawMinutes, 10);
  if (Number.isNaN(hoursNum) || Number.isNaN(minutesNum)) return { hours: 0, minutes: 0 };
  return {
    hours: clampToRange(hoursNum, 0, 23),
    minutes: clampToRange(minutesNum, 0, 59),
  };
};

export const formatTimeValue = (parts: TimeParts): TimeValue => {
  const safeHours = clampToRange(parts.hours ?? 0, 0, 23);
  const safeMinutes = clampToRange(parts.minutes ?? 0, 0, 59);
  return `${pad(safeHours)}:${pad(safeMinutes)}`;
};

type NormalizeOptions = {
  format: 12 | 24;
  hourItems: { hour24: number }[];
  minuteItems: { minute: number }[];
  meridiemItems: { meridiem: 'AM' | 'PM' }[];
};

export const normalizeTimeValue = (value: TimeParts, options: NormalizeOptions): TimeParts => {
  let hours = value.hours;
  let minutes = value.minutes;

  if (options.format === 24 && options.hourItems.length) {
    const hasHour = options.hourItems.some((h) => h.hour24 === hours);
    if (!hasHour) hours = options.hourItems[0].hour24;
  }

  if (options.minuteItems.length) {
    const hasMinute = options.minuteItems.some((m) => m.minute === minutes);
    if (!hasMinute) minutes = options.minuteItems[0].minute;
  }

  if (options.format === 12 && options.meridiemItems.length === 1) {
    const target = options.meridiemItems[0].meridiem;
    const isPM = hours >= 12;
    if (target === 'AM' && isPM) hours -= 12;
    if (target === 'PM' && !isPM) hours += 12;
  }

  if (options.format === 24 && options.hourItems.length) {
    const hasNormalizedHour = options.hourItems.some((h) => h.hour24 === hours);
    if (!hasNormalizedHour) hours = options.hourItems[0].hour24;
  }

  return { hours, minutes };
};
