import * as React from 'react';
import { View } from 'react-native';
import { Popover, type PopoverRef } from '../popover/popover';
import { Field } from '../field/field';
import { cn } from '../../lib/utils/utils';
import { SelectCtx } from './context';
import { SelectProps, SelectContextValue } from './types';
import { SelectTrigger } from './trigger';
import { SelectList } from './list';

export function SelectRootInner<T>(props: SelectProps<T>) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled = false,
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
    multiple = false,
    ...rest
  } = props as any;

  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue);
  const selected = (multiple ? undefined : isControlled ? value : internal) as T | undefined;
  const [selectedSet] = React.useState<Set<T>>(() => new Set());
  const popoverRef = React.useRef<PopoverRef>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined);

  const setSelectedSingle = React.useCallback(
    (val: T) => {
      if (!isControlled) setInternal(val);
      onChange?.(val);
      if (!multiple) popoverRef.current?.hide();
    },
    [isControlled, onChange, multiple]
  );

  const ctxValue = React.useMemo<SelectContextValue<T>>(
    () => ({
      options,
      placeholder,
      disabled: !!disabled,
      optionClassName,
      optionTextClassName,
      selectedClassName,
      renderOption,
      showIndicator,
      indicator,
      maxHeight,
      matchTriggerWidth,
      multiple,
      selected,
      selectedSet: multiple ? selectedSet : undefined,
      isSelected: (opt) => (multiple ? selectedSet.has(opt.value) : opt.value === selected),
      select: (val: T) => {
        if (multiple) {
          if (selectedSet.has(val)) selectedSet.delete(val);
          else selectedSet.add(val);
          setInternal((prev) => prev); // trigger re-render
        } else {
          setSelectedSingle(val);
        }
      },
      closeAfterSelect: !multiple,
      popoverRef: popoverRef as React.RefObject<PopoverRef>,
      triggerWidth,
      setTriggerWidth: (w) => setTriggerWidth(w),
    }),
    [
      options,
      placeholder,
      disabled,
      optionClassName,
      optionTextClassName,
      selectedClassName,
      renderOption,
      showIndicator,
      indicator,
      maxHeight,
      matchTriggerWidth,
      multiple,
      selected,
      selectedSet,
      setSelectedSingle,
      triggerWidth,
    ]
  );

  const list = <SelectList style={{ maxHeight }} />;

  const trigger = (
    <SelectTrigger
      placeholder={placeholder}
      className={className}
      style={style}
      matchTriggerWidth={matchTriggerWidth}
      {...rest}
    />
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
      disabled={!!disabled}
    >
      {trigger}
    </Popover>
  );

  return (
    <SelectCtx.Provider value={ctxValue}>
      {fieldProps ? <Field {...fieldProps}>{body}</Field> : body}
    </SelectCtx.Provider>
  );
}
