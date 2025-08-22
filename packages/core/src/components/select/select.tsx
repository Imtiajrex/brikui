import * as React from 'react';
import { FlatList, Pressable, View, ViewStyle } from 'react-native';
import { Text } from '../base/text';
import { Popover, type PopoverRef } from '../popover/popover';
import { cn } from '../../lib/utils/utils';
import { Field, type FieldProps } from '../field/field';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface SelectProps<T = any>
  extends Omit<React.ComponentProps<typeof Pressable>, 'onChange'> {
  options: SelectOption<T>[];
  value?: T; // controlled
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  optionClassName?: string;
  optionTextClassName?: string;
  selectedClassName?: string;
  popoverClassName?: string;
  popoverContentClassName?: string;
  maxHeight?: number;
  renderOption?: (opt: SelectOption<T>, selected: boolean) => React.ReactNode;
  fieldProps?: Omit<FieldProps, 'children'>; // integrate with Field for label/description/error
  showIndicator?: boolean;
  indicator?: React.ReactNode;
  matchTriggerWidth?: boolean;
  style?: ViewStyle;
}

interface InternalState<T> {
  selected: T | undefined;
}

export function Select<T = any>(props: SelectProps<T>) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled,
    optionClassName,
    optionTextClassName,
    selectedClassName = 'bg-background',
    popoverClassName,
    popoverContentClassName,
    className,
    style,
    maxHeight = 260,
    renderOption,
    fieldProps,
    showIndicator = true,
    indicator,
    matchTriggerWidth = true,
    onPress: userOnPress,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<InternalState<T>>({ selected: defaultValue });
  const selectedValue = isControlled ? value : internal.selected;
  const popoverRef = React.useRef<PopoverRef>(null);
  const triggerRef = React.useRef<View>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined);

  const selectedOption = options.find((o) => o.value === selectedValue);

  const setSelected = React.useCallback(
    (val: T) => {
      if (!isControlled) setInternal({ selected: val });
      onChange?.(val);
      // close after selecting
      popoverRef.current?.hide();
    },
    [isControlled, onChange]
  );

  const renderItem = ({ item }: { item: SelectOption<T> }) => {
    const selected = item.value === selectedValue;
    const disabledOpt = disabled || item.disabled;
    return (
      <Pressable
        key={(item.value as any)?.toString?.() ?? item.label}
        disabled={disabledOpt}
        onPress={() => setSelected(item.value)}
        className={cn(
          'px-3 py-2 rounded-md bg-card flex-row items-center justify-between',
          optionClassName,
          !selected && 'hover:bg-background',
          selected && selectedClassName,
          disabledOpt && 'opacity-50'
        )}
        accessibilityRole="button"
      >
        {renderOption ? (
          renderOption(item, selected)
        ) : (
          <Text className={cn('text-sm', optionTextClassName)}>{item.label}</Text>
        )}
        {showIndicator &&
          selected &&
          (indicator ?? <Text className="text-xs text-muted-foreground">✓</Text>)}
      </Pressable>
    );
  };

  const list = (
    <FlatList
      data={options}
      keyExtractor={(i) => (i.value as any)?.toString?.() ?? i.label}
      renderItem={renderItem}
      style={{ maxHeight }}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );

  const trigger = (
    <View
      ref={triggerRef}
      className={cn(
        'flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 min-h-10',
        disabled && 'opacity-50',
        className
      )}
      style={style}
      onLayout={(e) => {
        if (matchTriggerWidth) setTriggerWidth(e.nativeEvent.layout.width);
      }}
      {...rest}
    >
      <Text
        className={cn('text-sm text-foreground flex-1', !selectedOption && 'text-muted-foreground')}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Text>
      <Text className="ml-2 text-xs text-muted-foreground">▾</Text>
    </View>
  );

  const content = (
    <View style={matchTriggerWidth && triggerWidth ? { width: triggerWidth } : undefined}>
      {list}
    </View>
  );

  const body = (
    <Popover
      ref={popoverRef}
      placement="bottom"
      content={content}
      openOnPress={false}
      className={popoverClassName}
      contentClassName={popoverContentClassName}
      arrowSize={6}
      disabled={disabled}
    >
      {trigger}
    </Popover>
  );

  if (fieldProps) {
    return <Field {...fieldProps}>{body}</Field>;
  }
  return body;
}

Select.displayName = 'Select';
