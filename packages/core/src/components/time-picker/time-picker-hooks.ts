import * as React from 'react';
import type { TimeParts, TimeValue } from './time-picker.types';
import { pad } from './time-picker-utils';

export const useTimeValue = (
  value: TimeValue | undefined,
  defaultValue: TimeValue,
  onChange?: (val: TimeValue) => void
) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<TimeValue>(defaultValue);
  const current = isControlled ? (value as TimeValue) : internal;
  const lastValueRef = React.useRef<TimeValue>(current);

  React.useEffect(() => {
    lastValueRef.current = current;
  }, [current]);

  const updateValue = React.useCallback(
    (next: TimeValue | ((prev: TimeValue) => TimeValue), fire = true) => {
      if (isControlled) {
        const base = lastValueRef.current ?? defaultValue;
        const final =
          typeof next === 'function' ? (next as (p: TimeValue) => TimeValue)(base) : next;
        if (fire) onChange?.(final);
        lastValueRef.current = final;
      } else {
        setInternal((prev) => {
          const final =
            typeof next === 'function' ? (next as (p: TimeValue) => TimeValue)(prev) : next;
          if (fire) onChange?.(final);
          lastValueRef.current = final;
          return final;
        });
      }
    },
    [defaultValue, isControlled, onChange]
  );

  return { current, updateValue, isControlled };
};

export const useDisabledSets = (disabledHours?: number[], disabledMinutes?: number[]) =>
  React.useMemo(
    () => ({
      disabledHoursSet: new Set(disabledHours || []),
      disabledMinutesSet: new Set(disabledMinutes || []),
    }),
    [disabledHours, disabledMinutes]
  );

export const useHourItems = (
  format: 12 | 24,
  disabledHoursSet: Set<number>,
  hourLabelFormatter?: (h: number, displayHour: number) => string
) =>
  React.useMemo(() => {
    if (format === 24) {
      const list: { display: string; hour24: number }[] = [];
      for (let h = 0; h < 24; h++) {
        if (disabledHoursSet.has(h)) continue;
        const label = hourLabelFormatter ? hourLabelFormatter(h, h) : pad(h);
        list.push({ display: label, hour24: h });
      }
      return list;
    }
    const list: { display: string; hour24: number; displayHour: number }[] = [];
    for (let raw = 1; raw <= 12; raw++) {
      const internal24 = raw % 12;
      const label = hourLabelFormatter ? hourLabelFormatter(internal24, raw) : pad(raw);
      list.push({ display: label, hour24: internal24, displayHour: raw });
    }
    return list;
  }, [format, disabledHoursSet, hourLabelFormatter]);

export const useHourIndex = (format: 12 | 24, hourItems: any[], currentHour: number) =>
  React.useMemo(() => {
    if (format === 24) return hourItems.findIndex((h: any) => h.hour24 === currentHour);
    const displayHour =
      currentHour === 0 || currentHour === 12
        ? 12
        : currentHour > 12
        ? currentHour - 12
        : currentHour;
    return hourItems.findIndex((h: any) => h.displayHour === displayHour);
  }, [format, hourItems, currentHour]);

export const useMinuteItems = (
  minuteStep: number,
  disabledMinutesSet: Set<number>,
  minuteLabelFormatter?: (m: number) => string
) =>
  React.useMemo(() => {
    const list: { display: string; minute: number }[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      if (disabledMinutesSet.has(m)) continue;
      const label = minuteLabelFormatter ? minuteLabelFormatter(m) : pad(m);
      list.push({ display: label, minute: m });
    }
    return list;
  }, [minuteStep, disabledMinutesSet, minuteLabelFormatter]);

export const useMinuteIndex = (minuteItems: { minute: number }[], currentMinutes: number) =>
  React.useMemo(
    () => minuteItems.findIndex((mi) => mi.minute === currentMinutes),
    [minuteItems, currentMinutes]
  );

export const useMeridiemItems = (
  format: 12 | 24,
  disableAM?: boolean,
  disablePM?: boolean,
  meridiemLabelFormatter?: (meridiem: 'AM' | 'PM') => string
) =>
  React.useMemo(() => {
    if (format === 24) return [] as { display: string; meridiem: 'AM' | 'PM' }[];
    let arr: { display: string; meridiem: 'AM' | 'PM' }[] = [];
    if (!disableAM) arr.push({ display: meridiemLabelFormatter?.('AM') ?? 'AM', meridiem: 'AM' });
    if (!disablePM) arr.push({ display: meridiemLabelFormatter?.('PM') ?? 'PM', meridiem: 'PM' });
    if (arr.length === 0) {
      arr = [
        { display: meridiemLabelFormatter?.('AM') ?? 'AM', meridiem: 'AM' },
        { display: meridiemLabelFormatter?.('PM') ?? 'PM', meridiem: 'PM' },
      ];
    }
    return arr;
  }, [format, disableAM, disablePM, meridiemLabelFormatter]);

export const useMeridiemIndex = (
  meridiemItems: { meridiem: 'AM' | 'PM' }[],
  meridiem: 'AM' | 'PM'
) =>
  React.useMemo(
    () => meridiemItems.findIndex((m) => m.meridiem === meridiem),
    [meridiemItems, meridiem]
  );
