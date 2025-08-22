import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { WheelPicker } from '../wheel-picker/wheel-picker';
import { cn } from '../../lib/utils/utils';
import { Field, type FieldProps } from '../field/field';

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
  fieldProps?: Omit<FieldProps, 'children'>; // optional Field integration
  hourWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  minuteWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  meridiemWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  defaultValue = { hours: 0, minutes: 0 },
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
  fieldProps,
  hourWheelProps,
  minuteWheelProps,
  meridiemWheelProps,
}) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<TimeValue>(defaultValue);
  const current = isControlled ? (value as TimeValue) : internal;

  // Normalize disabled arrays for quick lookup
  const disabledHoursSet = React.useMemo(() => new Set(disabledHours || []), [disabledHours]);
  const disabledMinutesSet = React.useMemo(() => new Set(disabledMinutes || []), [disabledMinutes]);

  const meridiem: 'AM' | 'PM' = current.hours >= 12 ? 'PM' : 'AM';

  // Build hours options based on format
  const hourItems = React.useMemo(() => {
    if (format === 24) {
      const list: { display: string; hour24: number }[] = [];
      for (let h = 0; h < 24; h++) {
        if (disabledHoursSet.has(h)) continue;
        const label = hourLabelFormatter ? hourLabelFormatter(h, h) : pad(h);
        list.push({ display: label, hour24: h });
      }
      return list;
    }
    // 12h mode: displayHour 1..12 mapping to 24h hours across both AM/PM spins
    const list: { display: string; hour24: number; displayHour: number }[] = [];
    for (let raw = 1; raw <= 12; raw++) {
      // We'll keep both AM+PM possibilities; actual hour determined with meridiem wheel separately.
      // For wheel we only show displayHour; hour24 placeholder will be computed when selecting.
      const internal24 = raw % 12; // for label purpose only; actual selection decides later
      const label = hourLabelFormatter ? hourLabelFormatter(internal24, raw) : pad(raw);
      list.push({ display: label, hour24: internal24, displayHour: raw });
    }
    return list;
  }, [format, disabledHoursSet, hourLabelFormatter]);

  // Determine selected hour index
  const hourIndex = React.useMemo(() => {
    if (format === 24) {
      return hourItems.findIndex((h: any) => h.hour24 === current.hours);
    }
    // 12h mapping
    const displayHour = (() => {
      if (current.hours === 0) return 12; // 12 AM
      if (current.hours === 12) return 12; // 12 PM
      if (current.hours > 12) return current.hours - 12; // 1..11 PM
      return current.hours; // 1..11 AM
    })();
    return hourItems.findIndex((h: any) => h.displayHour === displayHour);
  }, [current.hours, hourItems, format]);

  // Minutes options
  const minuteItems = React.useMemo(() => {
    const list: { display: string; minute: number }[] = [];
    for (let m = 0; m < 60; m += minuteStep) {
      if (disabledMinutesSet.has(m)) continue;
      const label = minuteLabelFormatter ? minuteLabelFormatter(m) : pad(m);
      list.push({ display: label, minute: m });
    }
    return list;
  }, [minuteStep, disabledMinutesSet, minuteLabelFormatter]);

  const minuteIndex = React.useMemo(
    () => minuteItems.findIndex((mi) => mi.minute === current.minutes),
    [minuteItems, current.minutes]
  );

  // Meridiem options (12h only)
  const meridiemItems = React.useMemo(() => {
    if (format === 24) return [] as { display: string; meridiem: 'AM' | 'PM' }[];
    let arr: { display: string; meridiem: 'AM' | 'PM' }[] = [];
    if (!disableAM) arr.push({ display: meridiemLabelFormatter?.('AM') ?? 'AM', meridiem: 'AM' });
    if (!disablePM) arr.push({ display: meridiemLabelFormatter?.('PM') ?? 'PM', meridiem: 'PM' });
    if (arr.length === 0)
      arr = [
        { display: meridiemLabelFormatter?.('AM') ?? 'AM', meridiem: 'AM' },
        { display: meridiemLabelFormatter?.('PM') ?? 'PM', meridiem: 'PM' },
      ];
    return arr;
  }, [format, disableAM, disablePM, meridiemLabelFormatter]);

  const meridiemIndex = React.useMemo(
    () => meridiemItems.findIndex((m) => m.meridiem === meridiem),
    [meridiemItems, meridiem]
  );

  // Adjust current if meridiem becomes disabled via prop change
  React.useEffect(() => {
    if (format === 12) {
      if (meridiem === 'AM' && disableAM && !disablePM) {
        // switch to PM
        updateValue((prev) => {
          let hours = prev.hours;
          if (hours < 12) hours += 12; // convert to PM
          return { ...prev, hours };
        }, false);
      } else if (meridiem === 'PM' && disablePM && !disableAM) {
        updateValue((prev) => {
          let hours = prev.hours;
          if (hours >= 12) hours -= 12; // convert to AM
          return { ...prev, hours };
        }, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableAM, disablePM]);

  const updateValue = React.useCallback(
    (next: TimeValue | ((prev: TimeValue) => TimeValue), fire = true) => {
      const final = typeof next === 'function' ? (next as any)(current) : next;
      if (!isControlled) setInternal(final);
      if (fire) onChange?.(final);
    },
    [current, isControlled, onChange]
  );

  // Handlers for wheel commits
  const handleHourChange = (idx: number) => {
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
  };

  const handleMinuteChange = (idx: number) => {
    const item = minuteItems[idx];
    if (!item) return;
    if (disabledMinutesSet.has(item.minute)) return;
    updateValue({ hours: current.hours, minutes: item.minute });
  };

  const handleMeridiemChange = (idx: number) => {
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
  };

  const hourOptions = hourItems.map((h) => h.display);
  const minuteOptions = minuteItems.map((m) => m.display);
  const meridiemOptions = meridiemItems.map((m) => m.display);

  const wheels = (
    <View className={cn('flex-row items-stretch', className)} style={{ columnGap: gap }}>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          options={hourOptions}
          value={Math.max(0, hourIndex)}
          onChange={(i) => handleHourChange(i)}
          {...hourWheelProps}
        />
      </View>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          options={minuteOptions}
          value={Math.max(0, minuteIndex)}
          onChange={(i) => handleMinuteChange(i)}
          {...minuteWheelProps}
        />
      </View>
      {format === 12 && (
        <View style={{ width: wheelWidth * 0.75 }} className={cn(wheelClassName)}>
          <WheelPicker
            options={meridiemOptions}
            value={Math.max(0, meridiemIndex)}
            onChange={(i) => handleMeridiemChange(i)}
            {...meridiemWheelProps}
          />
        </View>
      )}
    </View>
  );

  if (fieldProps) return <Field {...fieldProps}>{wheels}</Field>;
  return wheels;
};

TimePicker.displayName = 'TimePicker';

export default TimePicker;
