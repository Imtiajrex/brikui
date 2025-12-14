import * as React from 'react';
import DateTimePicker, { type DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { useColorScheme } from 'nativewind';
import { cn } from '../../lib/utils/utils';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react-native';
import { useColor } from '../../lib/hooks/useColor';

export interface CalendarSingleChange {
  date?: DateType;
}
export interface CalendarRangeChange {
  startDate?: DateType;
  endDate?: DateType;
}
export interface CalendarMultiChange {
  dates?: DateType[];
}

type BaseProps = Omit<
  React.ComponentProps<typeof DateTimePicker>,
  'onChange' | 'date' | 'dates'
> & {
  /** Controlled single date */
  value?: DateType;
  /** Controlled range (start, end) */
  rangeValue?: { startDate?: DateType; endDate?: DateType };
  /** Controlled multiple */
  values?: DateType[];
  /** Uncontrolled default single date */
  defaultValue?: DateType;
  /** Callback unified across modes */
  onValueChange?: (
    payload: CalendarSingleChange & CalendarRangeChange & CalendarMultiChange
  ) => void;
  containerClassName?: string;
};

export interface CalendarProps extends BaseProps {}

export const Calendar = React.forwardRef<any, CalendarProps>(
  (
    {
      mode = 'single',
      value,
      rangeValue,
      values,
      defaultValue,
      onValueChange,
      containerClassName,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();
    const defaultStyles = useDefaultStyles(colorScheme);

    const [internalSingle, setInternalSingle] = React.useState<DateType | undefined>(defaultValue);
    const [internalRange, setInternalRange] = React.useState<{
      startDate?: DateType;
      endDate?: DateType;
    }>({});
    const [internalMulti, setInternalMulti] = React.useState<DateType[] | undefined>(undefined);

    const controlledSingle = value !== undefined;
    const controlledRange = !!rangeValue;
    const controlledMulti = !!values;

    const pickerProps: any = {};
    if (mode === 'single') {
      pickerProps.date = controlledSingle ? value : internalSingle;
    } else if (mode === 'range') {
      pickerProps.startDate = controlledRange ? rangeValue?.startDate : internalRange.startDate;
      pickerProps.endDate = controlledRange ? rangeValue?.endDate : internalRange.endDate;
    } else if (mode === 'multiple') {
      pickerProps.dates = controlledMulti ? values : internalMulti;
    }

    return (
      <DateTimePicker
        ref={ref}
        mode={mode as any}
        styles={{
          ...defaultStyles,
          month_selector_label: {
            ...defaultStyles.month_selector_label,
            color: useColor('primary'),
            fontWeight: 'bold',
            textDecorationLine: 'underline',
          },
          year_selector_label: {
            ...defaultStyles.year_selector_label,
            color: useColor('primary'),
            fontWeight: 'bold',
            textDecorationLine: 'underline',
          },
          ...stylesProp,
        }}
        components={{
          IconNext: <ArrowRight size={20} color={useColor('muted-foreground')} />,
          IconPrev: <ArrowLeft size={20} color={useColor('muted-foreground')} />,
        }}
        className={cn(containerClassName)}
        {...pickerProps}
        onChange={(payload: any) => {
          if (mode === 'single') {
            if (!controlledSingle) setInternalSingle(payload.date);
          } else if (mode === 'range') {
            if (!controlledRange)
              setInternalRange({ startDate: payload.startDate, endDate: payload.endDate });
          } else if (mode === 'multiple') {
            if (!controlledMulti) setInternalMulti(payload.dates);
          }
          onValueChange?.(payload);
        }}
        {...rest}
      />
    );
  }
);

Calendar.displayName = 'Calendar';
