import { View } from 'react-native';

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react-native';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base';
import { Button } from '../button';
import { Icon } from '../icon/icon';
import { MONTHS } from './constants';

type CalendarHeaderProps = {
  displayMonth: Date;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function CalendarHeader({
  displayMonth,
  pickerOpen,
  onTogglePicker,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  const headerMonthIndex = displayMonth.getMonth();
  const headerYear = displayMonth.getFullYear();

  return (
    <View className="flex-row flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        disabled={!canGoPrev}
        onPress={onPrev}
      >
        <Icon as={ChevronLeft} className="text-muted-foreground size-5" />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        className={cn('rounded-full px-4', pickerOpen && 'border-ring border')}
        onPress={onTogglePicker}
      >
        <Text className="font-semibold">
          {MONTHS[headerMonthIndex]} {headerYear}
        </Text>
        <Icon as={pickerOpen ? ChevronUp : ChevronDown} className="text-muted-foreground size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        disabled={!canGoNext}
        onPress={onNext}
      >
        <Icon as={ChevronRight} className="text-muted-foreground size-5" />
      </Button>
    </View>
  );
}

export { CalendarHeader };
export type { CalendarHeaderProps };
