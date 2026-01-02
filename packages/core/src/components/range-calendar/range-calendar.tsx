import * as React from 'react';
import { Pressable, View } from 'react-native';

import { MonthYearOverlay } from '../calendar/month-year-overlay';
import { MONTHS } from '../calendar/constants';
import { CalendarHeader } from '../calendar/calendar-header';
import { CalendarWeekdaysRow } from '../calendar/calendar-weekdays-row';
import {
  addMonths,
  buildMonthGrid,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from '../calendar/date-utils';
import { useCalendarShell } from '../calendar/use-calendar-shell';
import { useControllableState } from '../calendar/use-controllable-state';
import type { FirstDayOfWeek, PageBehavior } from '../calendar/types';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base';

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type RangeCalendarProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  fromYear?: number;
  toYear?: number;
  visibleMonths?: 1 | 2 | 3;
  firstDayOfWeek?: FirstDayOfWeek;
  pageBehavior?: PageBehavior;
  disabled?: (date: Date) => boolean;
  isDateUnavailable?: (date: Date) => boolean;
  className?: string;
  monthYearPickerContainerClassName?: string;
};

function normalizeRange(range?: DateRange): DateRange {
  if (!range) return {};
  const from = range.from ? startOfDay(range.from) : undefined;
  const to = range.to ? startOfDay(range.to) : undefined;
  if (from && to && from.getTime() > to.getTime()) return { from: to, to: from };
  return { from, to };
}

function isInInclusiveRange(day: Date, from: Date, to: Date) {
  const t = day.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

type RangeCalendarMonthGridProps = {
  displayMonth: Date;
  firstDayOfWeekIndex: number;
  selectedRange?: DateRange;
  previewRange?: DateRange;
  today: Date;
  disabled?: (date: Date) => boolean;
  isDateUnavailable?: (date: Date) => boolean;
  pickerOpen: boolean;
  onSelectDay: (day: Date) => void;
  onHoverDay?: (day?: Date) => void;
};

function RangeCalendarMonthGrid({
  displayMonth,
  firstDayOfWeekIndex,
  selectedRange,
  previewRange,
  today,
  disabled,
  isDateUnavailable,
  pickerOpen,
  onSelectDay,
  onHoverDay,
}: RangeCalendarMonthGridProps) {
  const grid = React.useMemo(
    () => buildMonthGrid(displayMonth, firstDayOfWeekIndex),
    [displayMonth, firstDayOfWeekIndex]
  );

  const { from, to } = React.useMemo(() => {
    const normalizedSelected = normalizeRange(selectedRange);
    const normalizedPreview = normalizeRange(previewRange);
    if (normalizedSelected.from && normalizedSelected.to) return normalizedSelected;
    if (normalizedPreview.from && normalizedPreview.to) return normalizedPreview;
    return normalizedSelected;
  }, [selectedRange, previewRange]);

  return (
    <View className="mt-2">
      {grid.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} className="flex-row">
          {week.map((day, dayIndex) => {
            const outside = !isSameMonth(day, displayMonth);
            const dayDisabled = outside || Boolean(disabled?.(day));
            const unavailable = !outside && Boolean(isDateUnavailable?.(day));
            const isToday = !outside && isSameDay(day, today);

            const isStart = Boolean(from && !outside && isSameDay(day, from));
            const isEnd = Boolean(to && !outside && isSameDay(day, to));
            const hasFullRange = Boolean(from && to);
            const inRange =
              hasFullRange && !outside && isInInclusiveRange(day, from as Date, to as Date);

            const endpointSelected = isStart || isEnd;

            const prevDay = week[dayIndex - 1];
            const nextDay = week[dayIndex + 1];
            const prevInRange =
              inRange &&
              prevDay &&
              isSameMonth(prevDay, displayMonth) &&
              isInInclusiveRange(prevDay, from as Date, to as Date);
            const nextInRange =
              inRange &&
              nextDay &&
              isSameMonth(nextDay, displayMonth) &&
              isInInclusiveRange(nextDay, from as Date, to as Date);

            const segmentStart = inRange && !prevInRange;
            const segmentEnd = inRange && !nextInRange;

            return (
              <View key={`day-${dayIndex}`} className="flex-1 items-center justify-center py-1">
                <View className="relative h-8 w-full items-center justify-center">
                  <View
                    pointerEvents="none"
                    className={cn(
                      'absolute inset-y-0 left-0 right-0',
                      inRange && 'bg-primary/10',
                      segmentStart && 'rounded-l-full',
                      segmentEnd && 'rounded-r-full'
                    )}
                  />

                  <Pressable
                    disabled={dayDisabled || pickerOpen}
                    onPress={() => {
                      if (unavailable) return;
                      onSelectDay(day);
                    }}
                    onHoverIn={() => {
                      if (pickerOpen) return;
                      if (dayDisabled || unavailable) return;
                      onHoverDay?.(day);
                    }}
                    onHoverOut={() => {
                      if (pickerOpen) return;
                      onHoverDay?.(undefined);
                    }}
                    accessibilityState={{
                      disabled: dayDisabled || unavailable,
                    }}
                    className={cn(
                      'h-8 w-full items-center justify-center rounded-full',
                      endpointSelected && 'bg-primary',
                      !endpointSelected && isToday && 'border-primary bg-primary/10 border',
                      dayDisabled && 'opacity-40'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-base',
                        endpointSelected && 'text-primary-foreground',
                        !endpointSelected && inRange && 'text-primary',
                        !endpointSelected && unavailable && 'text-destructive',
                        !endpointSelected && outside && 'text-muted-foreground',
                        !endpointSelected && !outside && !inRange && 'text-foreground'
                      )}
                      selectable={false}
                    >
                      {day.getDate()}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  fromYear,
  toYear,
  visibleMonths,
  firstDayOfWeek,
  pageBehavior,
  disabled,
  isDateUnavailable,
  className,
  monthYearPickerContainerClassName,
}: RangeCalendarProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [hoveredDay, setHoveredDay] = React.useState<Date | undefined>(undefined);
  const hoverClearTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (hoverClearTimeoutRef.current) {
        clearTimeout(hoverClearTimeoutRef.current);
        hoverClearTimeoutRef.current = null;
      }
    };
  }, []);

  const [selectedRangeRaw, setSelectedRangeRaw] = useControllableState<DateRange | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const selectedRange = React.useMemo(() => normalizeRange(selectedRangeRaw), [selectedRangeRaw]);

  const hoverPreviewRange = React.useMemo<DateRange | undefined>(() => {
    if (!selectedRange.from || selectedRange.to) return undefined;
    if (!hoveredDay) return undefined;
    return normalizeRange({ from: selectedRange.from, to: hoveredDay });
  }, [hoveredDay, selectedRange.from, selectedRange.to]);

  const initialMonth = React.useMemo(() => {
    const basis = defaultMonth ?? selectedRange.from ?? selectedRange.to ?? today;
    return startOfMonth(basis);
  }, [defaultMonth, selectedRange.from, selectedRange.to, today]);

  const {
    displayMonth,
    setDisplayMonth,
    locale,
    firstDayOfWeekIndex,
    safeVisibleMonths,
    pageStep,
    monthsToRender,
    years,
    months,
    canGoPrev,
    canGoNext,
    pickerOpen,
    setPickerOpen,
    onMonthWheel,
    onYearWheel,
  } = useCalendarShell({
    initialMonth,
    month,
    onMonthChange,
    fromYear,
    toYear,
    visibleMonths,
    firstDayOfWeek,
    pageBehavior,
  });

  const headerMonthIndex = displayMonth.getMonth();
  const headerYear = displayMonth.getFullYear();

  const onSelectDay = React.useCallback(
    (day: Date) => {
      if (disabled?.(day)) return;
      if (isDateUnavailable?.(day)) return;
      if (hoverClearTimeoutRef.current) {
        clearTimeout(hoverClearTimeoutRef.current);
        hoverClearTimeoutRef.current = null;
      }
      setHoveredDay(undefined);

      const nextDay = startOfDay(day);
      const current = normalizeRange(selectedRangeRaw);

      // Start a new range
      if (!current.from || (current.from && current.to)) {
        setSelectedRangeRaw({ from: nextDay, to: undefined });
        return;
      }

      // Finish range
      const fromDay = startOfDay(current.from);
      if (nextDay.getTime() < fromDay.getTime()) {
        setSelectedRangeRaw({ from: nextDay, to: fromDay });
        return;
      }
      setSelectedRangeRaw({ from: fromDay, to: nextDay });
    },
    [disabled, isDateUnavailable, selectedRangeRaw, setSelectedRangeRaw]
  );

  const onHoverDay = React.useCallback((day?: Date) => {
    if (hoverClearTimeoutRef.current) {
      clearTimeout(hoverClearTimeoutRef.current);
      hoverClearTimeoutRef.current = null;
    }

    if (day) {
      setHoveredDay(startOfDay(day));
      return;
    }

    hoverClearTimeoutRef.current = setTimeout(() => {
      setHoveredDay(undefined);
      hoverClearTimeoutRef.current = null;
    }, 500);
  }, []);

  return (
    <View
      className={cn(
        'bg-card border-border rounded-xl border p-4 shadow-sm shadow-black/5',
        className
      )}
    >
      <CalendarHeader
        displayMonth={displayMonth}
        pickerOpen={pickerOpen}
        onTogglePicker={() => setPickerOpen((o) => !o)}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={() => setDisplayMonth(addMonths(displayMonth, -pageStep))}
        onNext={() => setDisplayMonth(addMonths(displayMonth, pageStep))}
      />

      <View className="mt-3 relative">
        <View className={cn(safeVisibleMonths > 1 && 'flex-row gap-4')}>
          {monthsToRender.map((m) => (
            <View
              key={`${m.getFullYear()}-${m.getMonth()}`}
              className={cn(safeVisibleMonths > 1 && 'flex-1')}
            >
              {safeVisibleMonths > 1 && (
                <Text variant="small" className="mb-1 text-center font-semibold">
                  {MONTHS[m.getMonth()]} {m.getFullYear()}
                </Text>
              )}
              <CalendarWeekdaysRow firstDayOfWeekIndex={firstDayOfWeekIndex} locale={locale} />

              <RangeCalendarMonthGrid
                displayMonth={m}
                firstDayOfWeekIndex={firstDayOfWeekIndex}
                selectedRange={selectedRange}
                previewRange={hoverPreviewRange}
                today={today}
                disabled={disabled}
                isDateUnavailable={isDateUnavailable}
                pickerOpen={pickerOpen}
                onSelectDay={onSelectDay}
                onHoverDay={onHoverDay}
              />
            </View>
          ))}
        </View>

        <MonthYearOverlay
          open={pickerOpen}
          months={months}
          years={years}
          monthIndex={headerMonthIndex}
          year={headerYear}
          onMonthChange={onMonthWheel}
          onYearChange={onYearWheel}
          monthYearPickerContainerClassName={monthYearPickerContainerClassName}
        />
      </View>
    </View>
  );
}

export { RangeCalendar };
