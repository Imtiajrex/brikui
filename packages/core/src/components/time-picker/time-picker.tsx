import * as React from 'react';
import { View } from '../base/view';
import { WheelPicker } from '../wheelpicker/wheelpicker';
import { cn } from '../../lib/utils/utils';
import type { TimePickerProps, TimeValue } from './time-picker.types';
import { formatTimeValue, normalizeTimeValue, parseTimeValue } from './time-picker-utils';
import {
  useDisabledSets,
  useHourIndex,
  useHourItems,
  useMeridiemIndex,
  useMeridiemItems,
  useMinuteIndex,
  useMinuteItems,
  useTimeValue,
} from './time-picker-hooks';

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
  const resolvedDefaultValue = React.useMemo(() => defaultValue ?? '00:00', [defaultValue]);
  const defaultParts = React.useMemo(
    () => parseTimeValue(resolvedDefaultValue),
    [resolvedDefaultValue]
  );

  const { current, updateValue, isControlled } = useTimeValue(
    value,
    resolvedDefaultValue,
    onChange
  );
  const { disabledHoursSet, disabledMinutesSet } = useDisabledSets(disabledHours, disabledMinutes);

  const hourItems = useHourItems(format, disabledHoursSet, hourLabelFormatter);
  const minuteItems = useMinuteItems(minuteStep, disabledMinutesSet, minuteLabelFormatter);
  const meridiemItems = useMeridiemItems(format, disableAM, disablePM, meridiemLabelFormatter);

  const parsedCurrent = React.useMemo(() => parseTimeValue(current), [current]);

  const normalizedValue = React.useMemo(
    () =>
      normalizeTimeValue(parsedCurrent, {
        format,
        hourItems,
        minuteItems,
        meridiemItems,
      }),
    [parsedCurrent, current, format, hourItems, minuteItems, meridiemItems]
  );

  React.useEffect(() => {
    if (isControlled) return;
    const normalizedString = formatTimeValue(normalizedValue);
    if (normalizedString !== current) updateValue(normalizedString, false);
  }, [current, isControlled, normalizedValue, updateValue]);

  const meridiem: 'AM' | 'PM' = normalizedValue.hours >= 12 ? 'PM' : 'AM';

  const hourIndex = useHourIndex(format, hourItems, normalizedValue.hours);
  const minuteIndex = useMinuteIndex(minuteItems, normalizedValue.minutes);
  const meridiemIndex = useMeridiemIndex(meridiemItems, meridiem);

  const selectedHourValue = hourItems[hourIndex]?.hour24 ?? hourItems[0]?.hour24;
  const selectedMinuteValue = minuteItems[minuteIndex]?.minute ?? minuteItems[0]?.minute;
  const selectedMeridiemValue =
    format === 12
      ? meridiemItems[meridiemIndex]?.meridiem ?? meridiemItems[0]?.meridiem
      : undefined;

  // Handlers for wheel commits
  const handleHourChange = React.useCallback(
    (val: unknown) => {
      const numericHour = typeof val === 'number' ? val : Number(val);
      if (Number.isNaN(numericHour)) return;
      updateValue((prev) => {
        const prevParts = parseTimeValue(prev);
        if (format === 24) {
          if (disabledHoursSet.has(numericHour)) return prev;
          return formatTimeValue({ hours: numericHour, minutes: prevParts.minutes });
        }

        const hour24 = hourItems.find((h: any) => h.hour24 === numericHour)?.hour24 ?? numericHour;
        const currentMeridiem = prevParts.hours >= 12 ? 'PM' : 'AM';
        const newHours = currentMeridiem === 'AM' ? (hour24 === 12 ? 0 : hour24) : hour24 + 12;
        if (disabledHoursSet.has(newHours)) return prev;
        return formatTimeValue({ hours: newHours, minutes: prevParts.minutes });
      });
    },
    [disabledHoursSet, format, hourItems, updateValue]
  );

  const handleMinuteChange = React.useCallback(
    (minute: unknown) => {
      const numericMinute = typeof minute === 'number' ? minute : Number(minute);
      if (Number.isNaN(numericMinute)) return;
      if (disabledMinutesSet.has(numericMinute)) return;
      updateValue((prev) => {
        const prevParts = parseTimeValue(prev);
        return formatTimeValue({ hours: prevParts.hours, minutes: numericMinute });
      });
    },
    [disabledMinutesSet, updateValue]
  );

  const handleMeridiemChange = React.useCallback(
    (next: unknown) => {
      if (next !== 'AM' && next !== 'PM') return;
      if (format === 24) return;
      updateValue((prev) => {
        const prevParts = parseTimeValue(prev);
        const currentMeridiem = prevParts.hours >= 12 ? 'PM' : 'AM';
        if (next === currentMeridiem) return prev;

        const newHours = (() => {
          if (next === 'AM') {
            if (prevParts.hours === 12) return 0;
            if (prevParts.hours > 12) return prevParts.hours - 12;
            return prevParts.hours;
          }
          if (prevParts.hours === 0) return 12;
          if (prevParts.hours < 12) return prevParts.hours + 12;
          return prevParts.hours;
        })();

        if (disabledHoursSet.has(newHours)) return prev;
        return formatTimeValue({ hours: newHours, minutes: prevParts.minutes });
      });
    },
    [disabledHoursSet, format, updateValue]
  );

  const hourOptions = React.useMemo(
    () =>
      hourItems.map(
        (h) =>
          ({
            label: h.display,
            value: h.hour24,
          } as const)
      ),
    [hourItems]
  );
  const minuteOptions = React.useMemo(
    () => minuteItems.map((m) => ({ label: m.display, value: m.minute } as const)),
    [minuteItems]
  );
  const meridiemOptions = React.useMemo(
    () => meridiemItems.map((m) => ({ label: m.display, value: m.meridiem } as const)),
    [meridiemItems]
  );

  const wheels = (
    <View className={cn('flex-row justify-center', className)} style={{ columnGap: gap }}>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          items={hourOptions}
          value={selectedHourValue}
          defaultValue={defaultParts.hours}
          onValueChange={handleHourChange}
          {...hourWheelProps}
        />
      </View>
      <View style={{ width: wheelWidth }} className={cn(wheelClassName)}>
        <WheelPicker
          items={minuteOptions}
          value={selectedMinuteValue}
          defaultValue={defaultParts.minutes}
          onValueChange={handleMinuteChange}
          {...minuteWheelProps}
        />
      </View>
      {format === 12 && (
        <View style={{ width: wheelWidth * 0.75 }} className={cn(wheelClassName)}>
          <WheelPicker
            items={meridiemOptions}
            value={selectedMeridiemValue}
            defaultValue={defaultParts.hours >= 12 ? 'PM' : 'AM'}
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

export { formatTimeValue, parseTimeValue } from './time-picker-utils';
export type { TimePickerProps, TimeValue } from './time-picker.types';
