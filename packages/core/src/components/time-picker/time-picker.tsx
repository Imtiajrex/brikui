import * as React from 'react';
import { View } from '../base/view';
import { WheelPicker } from '../wheelpicker/wheelpicker';
import { cn } from '../../lib/utils/utils';

export interface TimeValue {
  hours: number; // 0-23
  minutes: number; // 0-59
}

export interface TimePickerProps {
  value?: TimeValue; // controlled 24h value
  defaultValue?: TimeValue; // uncontrolled initial
  onChange?: (val: TimeValue) => void;
  format?: 12 | 24; // display mode (default 12)
  minuteStep?: number; // minute granularity (default 1)
  disabled?: boolean;
  disabledHours?: number[]; // list of 24h hours to disable (0-23)
  disabledMinutes?: number[]; // list of minutes to disable (0-59)
  disableAM?: boolean;
  disablePM?: boolean;
  hourLabelFormatter?: (h: number, displayHour: number) => string; // h=24h internal, displayHour=12h or 24h shown
  minuteLabelFormatter?: (m: number) => string;
  meridiemLabelFormatter?: (meridiem: 'AM' | 'PM') => string;
  className?: string; // wrapper (excluding Field wrapper)
  wheelClassName?: string; // each wheel wrapper
  wheelWidth?: number; // fixed width for wheel container
  gap?: number; // horizontal gap between wheels (default 12)
  hourWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  minuteWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  meridiemWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const useTimeValue = (
  value: TimeValue | undefined,
  defaultValue: TimeValue,
  onChange?: (val: TimeValue) => void
) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<TimeValue>(defaultValue);
  const current = isControlled ? (value as TimeValue) : internal;

  const updateValue = React.useCallback(
    (next: TimeValue | ((prev: TimeValue) => TimeValue), fire = true) => {
      if (isControlled) {
        const base = value ?? defaultValue;
        const final =
          typeof next === 'function' ? (next as (p: TimeValue) => TimeValue)(base) : next;
        if (fire) onChange?.(final);
      } else {
        setInternal((prev) => {
          const final =
            typeof next === 'function' ? (next as (p: TimeValue) => TimeValue)(prev) : next;
          if (fire) onChange?.(final);
          return final;
        });
      }
    },
    [defaultValue, isControlled, onChange, value]
  );

  return { current, updateValue };
};

const useDisabledSets = (disabledHours?: number[], disabledMinutes?: number[]) =>
  React.useMemo(
    () => ({
      disabledHoursSet: new Set(disabledHours || []),
      disabledMinutesSet: new Set(disabledMinutes || []),
    }),
    [disabledHours, disabledMinutes]
  );

const useHourItems = (
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

const useHourIndex = (format: 12 | 24, hourItems: any[], currentHour: number) =>
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

const useMinuteItems = (
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

const useMinuteIndex = (minuteItems: { minute: number }[], currentMinutes: number) =>
  React.useMemo(
    () => minuteItems.findIndex((mi) => mi.minute === currentMinutes),
    [minuteItems, currentMinutes]
  );

const useMeridiemItems = (
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

const useMeridiemIndex = (meridiemItems: { meridiem: 'AM' | 'PM' }[], meridiem: 'AM' | 'PM') =>
  React.useMemo(
    () => meridiemItems.findIndex((m) => m.meridiem === meridiem),
    [meridiemItems, meridiem]
  );

const useMeridiemNormalization = (
  format: 12 | 24,
  meridiem: 'AM' | 'PM',
  disableAM: boolean | undefined,
  disablePM: boolean | undefined,
  updateValue: (next: TimeValue | ((prev: TimeValue) => TimeValue), fire?: boolean) => void
) => {
  React.useEffect(() => {
    if (format !== 12) return;
    if (meridiem === 'AM' && disableAM && !disablePM) {
      updateValue((prev) => {
        const hours = prev.hours < 12 ? prev.hours + 12 : prev.hours;
        return { ...prev, hours };
      }, false);
    } else if (meridiem === 'PM' && disablePM && !disableAM) {
      updateValue((prev) => {
        const hours = prev.hours >= 12 ? prev.hours - 12 : prev.hours;
        return { ...prev, hours };
      }, false);
    }
  }, [disableAM, disablePM, format, meridiem, updateValue]);
};

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  defaultValue,
  onChange,
  format = 12,
  minuteStep = 1,
  disabled,
  disabledHours,
  disabledMinutes,
  disableAM,
  disablePM,
  hourLabelFormatter,
  minuteLabelFormatter,
  meridiemLabelFormatter,
  className,
  wheelClassName,
  wheelWidth = 72,
  gap = 12,
  hourWheelProps,
  minuteWheelProps,
  meridiemWheelProps,
}) => {
  const resolvedDefaultValue = React.useMemo(
    () => defaultValue ?? { hours: 0, minutes: 0 },
    [defaultValue?.hours, defaultValue?.minutes]
  );

  const { current, updateValue } = useTimeValue(value, resolvedDefaultValue, onChange);
  const { disabledHoursSet, disabledMinutesSet } = useDisabledSets(disabledHours, disabledMinutes);
  const meridiem: 'AM' | 'PM' = current.hours >= 12 ? 'PM' : 'AM';

  const hourItems = useHourItems(format, disabledHoursSet, hourLabelFormatter);
  const hourIndex = useHourIndex(format, hourItems, current.hours);

  const minuteItems = useMinuteItems(minuteStep, disabledMinutesSet, minuteLabelFormatter);
  const minuteIndex = useMinuteIndex(minuteItems, current.minutes);

  const meridiemItems = useMeridiemItems(format, disableAM, disablePM, meridiemLabelFormatter);
  const meridiemIndex = useMeridiemIndex(meridiemItems, meridiem);

  useMeridiemNormalization(format, meridiem, disableAM, disablePM, updateValue);

  React.useEffect(() => {
    if (hourIndex !== -1 || !hourItems.length) return;
    updateValue((prev) => ({ ...prev, hours: hourItems[0].hour24 }));
  }, [hourIndex, hourItems, updateValue]);

  React.useEffect(() => {
    if (minuteIndex !== -1 || !minuteItems.length) return;
    updateValue((prev) => ({ ...prev, minutes: minuteItems[0].minute }));
  }, [minuteIndex, minuteItems, updateValue]);

  React.useEffect(() => {
    if (format !== 12) return;
    if (meridiemIndex !== -1 || !meridiemItems.length) return;
    const targetMeridiem = meridiemItems[0].meridiem;
    updateValue((prev) => {
      if (targetMeridiem === 'AM') {
        return prev.hours >= 12 ? { ...prev, hours: prev.hours - 12 } : prev;
      }
      return prev.hours < 12 ? { ...prev, hours: prev.hours + 12 } : prev;
    });
  }, [format, meridiemIndex, meridiemItems, updateValue]);

  const safeHourIndex = hourIndex < 0 ? 0 : hourIndex;
  const safeMinuteIndex = minuteIndex < 0 ? 0 : minuteIndex;
  const safeMeridiemIndex = meridiemIndex < 0 ? 0 : meridiemIndex;

  // Handlers for wheel commits
  const handleHourChange = React.useCallback(
    (_: any, idx: number) => {
      if (format === 24) {
        const item: any = hourItems[idx];
        if (!item) return;
        updateValue({ hours: item.hour24, minutes: current.minutes });
      } else {
        const item: any = hourItems[idx];
        if (!item) return;
        const displayHour: number = item.displayHour;
        const newHours = (() => {
          if (meridiem === 'AM') {
            if (displayHour === 12) return 0; // 12AM -> 0
            return displayHour; // 1..11 AM
          }
          // PM
          if (displayHour === 12) return 12; // 12PM -> 12
          return displayHour + 12; // 1..11 PM -> 13..23
        })();
        // Check disabledHoursSet with 24h value
        if (disabledHoursSet.has(newHours)) return; // ignore selection
        updateValue({ hours: newHours, minutes: current.minutes });
      }
    },
    [current.minutes, disabledHoursSet, format, hourItems, meridiem, updateValue]
  );

  const handleMinuteChange = React.useCallback(
    (_: any, idx: number) => {
      const item = minuteItems[idx];
      if (!item) return;
      if (disabledMinutesSet.has(item.minute)) return;
      updateValue({ hours: current.hours, minutes: item.minute });
    },
    [current.hours, disabledMinutesSet, minuteItems, updateValue]
  );

  const handleMeridiemChange = React.useCallback(
    (_: any, idx: number) => {
      if (format === 24) return;
      const item = meridiemItems[idx];
      if (!item) return;
      if (item.meridiem === meridiem) return; // unchanged
      const newHours = (() => {
        if (item.meridiem === 'AM') {
          // Convert to AM
          if (current.hours === 0) return 0;
          if (current.hours === 12) return 0; // 12PM -> 12AM (0)
          if (current.hours > 12) return current.hours - 12; // 13..23 -> 1..11
          return current.hours; // already AM 1..11
        } else {
          // Convert to PM
          if (current.hours === 12) return 12; // already 12PM
          if (current.hours === 0) return 12; // 12AM -> 12PM
          if (current.hours < 12) return current.hours + 12; // 1..11 -> 13..23
          return current.hours; // already PM 13..23
        }
      })();
      if (disabledHoursSet.has(newHours)) return; // avoid disabled
      updateValue({ hours: newHours, minutes: current.minutes });
    },
    [current.hours, current.minutes, disabledHoursSet, format, meridiem, meridiemItems, updateValue]
  );

  const hourOptions = React.useMemo(
    () =>
      hourItems.map((h) => ({
        label: h.display,
        value: h.hour24,
      })),
    [hourItems]
  );
  const minuteOptions = React.useMemo(
    () => minuteItems.map((m) => ({ label: m.display, value: m.minute })),
    [minuteItems]
  );
  const meridiemOptions = React.useMemo(
    () => meridiemItems.map((m) => ({ label: m.display, value: m.meridiem })),
    [meridiemItems]
  );

  const wheels = (
    <View className={cn('flex-row justify-center', className)} style={{ columnGap: gap }}>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          items={hourOptions}
          value={safeHourIndex}
          onValueChange={handleHourChange}
          {...hourWheelProps}
        />
      </View>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          items={minuteOptions}
          value={safeMinuteIndex}
          onValueChange={handleMinuteChange}
          {...minuteWheelProps}
        />
      </View>
      {format === 12 && (
        <View style={{ width: wheelWidth * 0.75 }} className={cn(wheelClassName)}>
          <WheelPicker
            items={meridiemOptions}
            value={safeMeridiemIndex}
            onValueChange={handleMeridiemChange}
            {...meridiemWheelProps}
          />
        </View>
      )}
    </View>
  );

  return wheels;
};

TimePicker.displayName = 'TimePicker';

export default TimePicker;
