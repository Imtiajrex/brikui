import * as React from 'react';
import { Pressable, View } from 'react-native';

import { buildMonthGrid, isSameDay, isSameMonth } from './date-utils';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base';

type CalendarMonthGridProps = {
  displayMonth: Date;
  firstDayOfWeekIndex: number;
  selectedDate?: Date;
  today: Date;
  disabled?: (date: Date) => boolean;
  isDateUnavailable?: (date: Date) => boolean;
  pickerOpen: boolean;
  onSelectDay: (day: Date) => void;
};

function CalendarMonthGrid({
  displayMonth,
  firstDayOfWeekIndex,
  selectedDate,
  today,
  disabled,
  isDateUnavailable,
  pickerOpen,
  onSelectDay,
}: CalendarMonthGridProps) {
  const grid = React.useMemo(
    () => buildMonthGrid(displayMonth, firstDayOfWeekIndex),
    [displayMonth, firstDayOfWeekIndex]
  );

  return (
    <View className="mt-2">
      {grid.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} className="flex flex-row">
          {week.map((day, dayIndex) => {
            const outside = !isSameMonth(day, displayMonth);
            const dayDisabled = outside || Boolean(disabled?.(day));
            const unavailable = !outside && Boolean(isDateUnavailable?.(day));
            const selected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isToday = isSameDay(day, today);

            return (
              <View key={`day-${dayIndex}`} className="flex-1 items-center justify-center py-1">
                <Pressable
                  disabled={dayDisabled || pickerOpen}
                  onPress={() => {
                    if (unavailable) return;
                    onSelectDay(day);
                  }}
                  accessibilityState={{
                    disabled: dayDisabled || unavailable,
                  }}
                  className={cn(
                    'h-8 w-8 items-center justify-center rounded-full',
                    selected && 'bg-primary',
                    !selected && isToday && 'border-primary bg-primary/10 border',
                    dayDisabled && 'opacity-40'
                  )}
                >
                  <Text
                    className={cn(
                      'text-base',
                      selected && 'text-primary-foreground',
                      !selected && unavailable && 'text-destructive',
                      !selected && outside && 'text-muted-foreground',
                      !selected && !outside && 'text-foreground'
                    )}
                    selectable={false}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export { CalendarMonthGrid };
export type { CalendarMonthGridProps };
