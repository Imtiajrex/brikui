import * as React from 'react';
import { View } from 'react-native';

import { MonthYearOverlay } from './month-year-overlay';
import { MONTHS } from './constants';
import { CalendarHeader } from './calendar-header';
import { CalendarMonthGrid } from './calendar-month-grid';
import { CalendarWeekdaysRow } from './calendar-weekdays-row';
import { addMonths, startOfDay, startOfMonth } from './date-utils';
import { useControllableState } from './use-controllable-state';
import { useCalendarShell } from './use-calendar-shell';
import type { CalendarProps } from './types';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base';

export type { CalendarProps };

function Calendar({
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
}: CalendarProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useControllableState<Date | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const initialMonth = React.useMemo(() => {
    const basis = defaultMonth ?? selectedDate ?? today;
    return startOfMonth(basis);
  }, [defaultMonth, selectedDate, today]);

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
      setSelectedDate(day);
    },
    [disabled, isDateUnavailable, setSelectedDate]
  );

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

              <CalendarMonthGrid
                displayMonth={m}
                firstDayOfWeekIndex={firstDayOfWeekIndex}
                selectedDate={selectedDate}
                today={today}
                disabled={disabled}
                isDateUnavailable={isDateUnavailable}
                pickerOpen={pickerOpen}
                onSelectDay={onSelectDay}
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

export { Calendar };
