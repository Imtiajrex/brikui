import * as React from 'react';
import { View } from 'react-native';

import { WheelPicker } from '../wheelpicker';
import type { Item } from './types';
import { cn } from '../../lib/utils/utils';

type MonthYearOverlayProps = {
  open: boolean;
  months: Array<Item<number>>;
  years: Array<Item<number>>;
  monthIndex: number;
  year: number;
  onMonthChange: (monthIndex: number) => void;
  onYearChange: (year: number) => void;
  monthYearPickerContainerClassName?: string;
};

function MonthYearOverlay({
  open,
  months,
  years,
  monthIndex,
  year,
  onMonthChange,
  onYearChange,
  monthYearPickerContainerClassName,
}: MonthYearOverlayProps) {
  if (!open) return null;

  return (
    <View className={cn('h-full w-full bg-card flex-1 gap-2 flex', 'absolute inset-0 z-10')}>
      <View
        className={cn(
          'flex-1 flex flex-row gap-2 w-full mx-auto',
          monthYearPickerContainerClassName
        )}
      >
        <WheelPicker
          items={months}
          value={monthIndex}
          onValueChange={onMonthChange}
          itemHeight={50}
          defaultValue={monthIndex}
          visibleItems={5}
          className="bg-card flex-1"
          overlayBgColorClassName="bg-card/50"
        />
        <WheelPicker
          items={years}
          value={year}
          onValueChange={onYearChange}
          defaultValue={year}
          itemHeight={50}
          visibleItems={5}
          className="bg-card flex-1"
          overlayBgColorClassName="bg-card/50"
        />
      </View>
    </View>
  );
}

export { MonthYearOverlay };
