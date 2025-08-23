import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Popover, type PopoverRef } from '../popover/popover';
import { Field, type FieldProps } from '../field/field';
import { TimePicker, type TimePickerProps, type TimeValue } from './time-picker';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';
import { ChevronDown, Clock } from 'lucide-react-native';
import { useColor } from '../../lib/hooks/useColor';

export interface TimePickerInputProps
  extends Omit<React.ComponentProps<typeof Pressable>, 'onChange' | 'children'> {
  value?: TimeValue; // controlled (24h)
  defaultValue?: TimeValue; // uncontrolled
  onChange?: (value: TimeValue) => void;
  format?: 12 | 24;
  minuteStep?: number;
  disabled?: boolean;
  placeholder?: string;
  closeOnSelect?: boolean; // close popover on first change (default true)
  fieldProps?: Omit<FieldProps, 'children'>;
  popoverClassName?: string;
  popoverContentClassName?: string;
  triggerClassName?: string;
  popoverWidth?: number; // width for popover (default 220)
  timePickerProps?: Omit<
    TimePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'format' | 'minuteStep' | 'disabled' | 'fieldProps'
  >;
  formatDisplay?: (value: TimeValue | undefined, opts: { format: 12 | 24 }) => string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  defaultValue,
  onChange,
  format = 12,
  minuteStep,
  disabled,
  placeholder = 'Select time',
  closeOnSelect = false,
  fieldProps,
  popoverClassName,
  popoverContentClassName,
  triggerClassName,
  popoverWidth = 220,
  timePickerProps,
  style,
  formatDisplay,
  ...pressableProps
}) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<TimeValue | undefined>(defaultValue);
  const current = isControlled ? value : internal;
  const popoverRef = React.useRef<PopoverRef>(null);

  const handleChange = React.useCallback(
    (val: TimeValue) => {
      if (!isControlled) setInternal(val);
      onChange?.(val);
      if (closeOnSelect) popoverRef.current?.hide();
    },
    [isControlled, onChange, closeOnSelect]
  );

  const displayText = React.useMemo(() => {
    if (formatDisplay) return formatDisplay(current, { format });
    if (!current) return placeholder;
    const h = current.hours;
    const m = current.minutes.toString().padStart(2, '0');
    if (format === 24) return `${h.toString().padStart(2, '0')}:${m}`;
    const meridiem = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${m} ${meridiem}`;
  }, [current, placeholder, format, formatDisplay]);

  const trigger = (
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
        'flex-row items-center justify-between rounded-input flex-1 px-2 py-2 min-h-10',
        disabled && 'opacity-50',
        triggerClassName
      )}
    >
      <Text
        className={cn('text-sm text-foreground flex-1', !current && 'text-muted-foreground')}
        numberOfLines={1}
      >
        {displayText}
      </Text>
    </Pressable>
  );

  const wheel = (
    <TimePicker
      value={current}
      onChange={handleChange}
      format={format}
      minuteStep={minuteStep}
      disabled={disabled}
      {...timePickerProps}
    />
  );

  const body = (
    <Popover
      ref={popoverRef}
      placement="bottom"
      content={
        <View style={{ width: popoverWidth }} className={cn('p-2', popoverContentClassName)}>
          {wheel}
        </View>
      }
      className={popoverClassName}
      openOnPress={false}
      arrowSize={6}
      disabled={disabled}
    >
      {trigger}
    </Popover>
  );

  return (
    <Field
      rightSection={
        <View>
          <Clock size={16} color={useColor('muted-foreground')} />
        </View>
      }
      {...fieldProps}
    >
      {body}
    </Field>
  );
};

TimePickerInput.displayName = 'TimePickerInput';

export default TimePickerInput;
