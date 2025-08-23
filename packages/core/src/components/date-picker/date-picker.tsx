import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../base/text';
import { Popover, type PopoverRef } from '../popover/popover';
import { Calendar, type CalendarProps } from '../calendar/calendar';
import { Field, type FieldProps } from '../field/field';
import { cn } from '../../lib/utils/utils';
import type { DateType } from 'react-native-ui-datepicker';
import { Calendar1 } from 'lucide-react-native';
import { useColor } from '../../lib/hooks/useColor';

export interface DatePickerProps
  extends Omit<React.ComponentProps<typeof Pressable>, 'onChange' | 'children'> {
  mode?: 'single' | 'range' | 'multiple';
  /** Controlled single value */
  value?: DateType;
  /** Controlled range value */
  rangeValue?: { startDate?: DateType; endDate?: DateType };
  /** Controlled multiple values */
  values?: DateType[];
  /** Uncontrolled defaults */
  defaultValue?: DateType;
  defaultRangeValue?: { startDate?: DateType; endDate?: DateType };
  defaultValues?: DateType[];
  /** Callback unified across modes */
  onChange?: (payload: {
    date?: DateType;
    startDate?: DateType;
    endDate?: DateType;
    dates?: DateType[];
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Close popover after a selection. For range it closes once both start & end picked. For multiple default false. */
  closeOnSelect?: boolean;
  /** Optional formatting function for display string in trigger */
  format?: (payload: {
    date?: DateType;
    startDate?: DateType;
    endDate?: DateType;
    dates?: DateType[];
    mode: 'single' | 'range' | 'multiple';
  }) => string;
  /** Pass extra props to Calendar. value props are managed above */
  calendarProps?: Omit<
    CalendarProps,
    'mode' | 'value' | 'rangeValue' | 'values' | 'defaultValue' | 'onValueChange'
  >;
  /** Integrate with Field (label, description, error, etc). If provided wraps the trigger */
  fieldProps?: Omit<FieldProps, 'children'>;
  /** Class name overrides */
  triggerClassName?: string;
  popoverClassName?: string;
  popoverContentClassName?: string;
  /** Fixed width for the popover (default 320) */
  popoverWidth?: number;
  /**
   * Custom trigger renderer. When provided, replaces the default Pressable trigger.
   * Useful for integrating with custom UI (icon buttons, chips, etc.).
   * Field container styling (border/rounded/background) will be stripped (border-none rounded-none bg-transparent).
   */
  renderTrigger?: (ctx: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: boolean;
    mode: 'single' | 'range' | 'multiple';
    date?: DateType;
    startDate?: DateType;
    endDate?: DateType;
    dates?: DateType[];
    display: string;
    disabled?: boolean;
  }) => React.ReactElement;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  value,
  rangeValue,
  values,
  defaultValue,
  defaultRangeValue,
  defaultValues,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  closeOnSelect = false,
  format,
  calendarProps,
  fieldProps,
  triggerClassName,
  popoverClassName,
  popoverContentClassName,
  popoverWidth = 320,
  style,
  renderTrigger,
  ...pressableProps
}) => {
  const isSingle = mode === 'single';
  const isRange = mode === 'range';
  const isMulti = mode === 'multiple';

  const isControlledSingle = value !== undefined;
  const isControlledRange = !!rangeValue;
  const isControlledMulti = !!values;

  const [internalSingle, setInternalSingle] = React.useState<DateType | undefined>(defaultValue);
  const [internalRange, setInternalRange] = React.useState<{
    startDate?: DateType;
    endDate?: DateType;
  }>(defaultRangeValue ?? {});
  const [internalMulti, setInternalMulti] = React.useState<DateType[] | undefined>(defaultValues);

  const currentSingle = isControlledSingle ? value : internalSingle;
  const currentRange = isControlledRange ? rangeValue : internalRange;
  const currentMulti = isControlledMulti ? values : internalMulti;

  const popoverRef = React.useRef<PopoverRef>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // Honor explicit closeOnSelect (default false for all modes)
  const shouldCloseOnSelect = closeOnSelect;

  const handleChange = React.useCallback(
    (payload: {
      date?: DateType;
      startDate?: DateType;
      endDate?: DateType;
      dates?: DateType[];
    }) => {
      if (isSingle) {
        if (!isControlledSingle) setInternalSingle(payload.date);
        onChange?.({ date: payload.date });
        if (shouldCloseOnSelect) popoverRef.current?.hide();
      } else if (isRange) {
        if (!isControlledRange)
          setInternalRange({ startDate: payload.startDate, endDate: payload.endDate });
        onChange?.({ startDate: payload.startDate, endDate: payload.endDate });
        if (
          shouldCloseOnSelect &&
          payload.startDate &&
          payload.endDate // close only when both selected
        ) {
          popoverRef.current?.hide();
        }
      } else if (isMulti) {
        if (!isControlledMulti) setInternalMulti(payload.dates);
        onChange?.({ dates: payload.dates });
        if (shouldCloseOnSelect) popoverRef.current?.hide();
      }
    },
    [
      isSingle,
      isRange,
      isMulti,
      isControlledSingle,
      isControlledRange,
      isControlledMulti,
      shouldCloseOnSelect,
      onChange,
    ]
  );

  const displayText = React.useMemo(() => {
    if (format) {
      return format({
        date: currentSingle,
        startDate: currentRange?.startDate,
        endDate: currentRange?.endDate,
        dates: currentMulti,
        mode,
      });
    }
    if (isSingle)
      return currentSingle ? new Date(currentSingle as any).toDateString() : placeholder;
    if (isRange) {
      const { startDate, endDate } = currentRange || {};
      if (!startDate && !endDate) return placeholder;
      const startStr = startDate ? new Date(startDate as any).toLocaleDateString() : '—';
      const endStr = endDate ? new Date(endDate as any).toLocaleDateString() : '—';
      return `${startStr} → ${endStr}`;
    }
    if (isMulti) {
      const count = currentMulti?.length || 0;
      return count ? `${count} selected` : placeholder;
    }
    return placeholder;
  }, [
    format,
    currentSingle,
    currentRange,
    currentMulti,
    isSingle,
    isRange,
    isMulti,
    placeholder,
    mode,
  ]);

  const defaultTrigger = (
    <Pressable
      disabled={disabled}
      style={style}
      {...pressableProps}
      accessibilityRole="button"
      onPress={(e) => {
        if (!disabled) popoverRef.current?.toggle();
        pressableProps.onPress?.(e as any);
      }}
      className={cn(
        'flex-row items-center flex-1 justify-between rounded-input px-3 py-2 min-h-10',
        disabled && 'opacity-50',
        triggerClassName
      )}
    >
      <Text
        className={cn(
          'text-sm text-foreground flex-1',
          ((isSingle && !currentSingle) ||
            (isRange && !currentRange?.startDate && !currentRange?.endDate) ||
            (isMulti && !(currentMulti && currentMulti.length))) &&
            'text-muted-foreground'
        )}
        numberOfLines={1}
      >
        {displayText}
      </Text>
    </Pressable>
  );

  const trigger = renderTrigger
    ? renderTrigger({
        open: () => popoverRef.current?.show(),
        close: () => popoverRef.current?.hide(),
        toggle: () => popoverRef.current?.toggle(),
        isOpen,
        mode,
        date: currentSingle,
        startDate: currentRange?.startDate,
        endDate: currentRange?.endDate,
        dates: currentMulti,
        display: displayText,
        disabled,
      })
    : defaultTrigger;

  const calendar = (
    <Calendar
      mode={mode as any}
      value={isSingle ? (currentSingle as any) : undefined}
      rangeValue={isRange ? (currentRange as any) : undefined}
      values={isMulti ? (currentMulti as any) : undefined}
      onValueChange={handleChange as any}
      showOutsideDays
      {...calendarProps}
    />
  );

  const body = (
    <Popover
      ref={popoverRef}
      placement="bottom"
      content={
        <View style={{ width: popoverWidth }} className={cn('p-1', popoverContentClassName)}>
          {calendar}
        </View>
      }
      className={popoverClassName}
      openOnPress={false}
      arrowSize={6}
      disabled={disabled}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      {trigger}
    </Popover>
  );

  const mergedFieldProps = React.useMemo(
    () =>
      renderTrigger
        ? {
            ...fieldProps,
            containerClassName: cn(
              'border-none rounded-none bg-transparent h-auto',
              fieldProps?.containerClassName
            ),
          }
        : fieldProps,
    [fieldProps, renderTrigger]
  );

  return (
    <Field
      rightSection={
        !renderTrigger ? (
          <View>
            <Calendar1 size={16} color={useColor('muted-foreground')} />
          </View>
        ) : null
      }
      {...mergedFieldProps}
    >
      {body}
    </Field>
  );
};

DatePicker.displayName = 'DatePicker';

export default DatePicker;
