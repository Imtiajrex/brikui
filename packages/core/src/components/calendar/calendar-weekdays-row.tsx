import * as React from 'react';
import { View } from 'react-native';

import { WEEKDAYS } from './constants';
import { Text } from '../base';

type CalendarWeekdaysRowProps = {
  firstDayOfWeekIndex: number;
  locale?: string;
};

function getWeekdayLabels(firstDayOfWeekIndex: number, locale?: string) {
  const safeFirst = Math.max(0, Math.min(6, firstDayOfWeekIndex));
  try {
    const tag = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
    const formatter = new Intl.DateTimeFormat(tag, { weekday: 'narrow' });
    // 1970-01-04 is a Sunday. Build a Sunday-first week then rotate.
    const base = new Date(1970, 0, 4);
    const sundayFirst = Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i))
    );
    return [...sundayFirst.slice(safeFirst), ...sundayFirst.slice(0, safeFirst)];
  } catch {
    return [...WEEKDAYS.slice(safeFirst), ...WEEKDAYS.slice(0, safeFirst)];
  }
}

function CalendarWeekdaysRow({ firstDayOfWeekIndex, locale }: CalendarWeekdaysRowProps) {
  const labels = React.useMemo(
    () => getWeekdayLabels(firstDayOfWeekIndex, locale),
    [firstDayOfWeekIndex, locale]
  );

  return (
    <View className="border-border border-t pt-2">
      <View className="flex-row">
        {labels.map((d, index) => (
          <View key={`weekday-${index}`} className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground text-sm font-medium">{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export { CalendarWeekdaysRow };
export type { CalendarWeekdaysRowProps };
