import * as React from 'react';
import { View } from 'react-native';
import { Popover, type PopoverRef } from '../popover/popover';
import { Field } from '../field/field';
import { cn } from '../../lib/utils/utils';
import { SelectCtx } from './context';
import { AnySelectProps, SelectProps, MultiSelectProps, SelectContextValue } from './types';
import { SelectTrigger } from './trigger';
import { SelectList } from './list';
import { Pressable } from '../base';
import { ChevronDown } from 'lucide-react-native';
import { useColor } from '../../lib/hooks/useColor';

export function SelectRootInner<T>(props: AnySelectProps<T>) {
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
    renderTrigger,
    ...rest
  } = props;
  const isMulti = multiple === true;
  const isControlled = value !== undefined;
  const [internalSingle, setInternalSingle] = React.useState<T | undefined>(
    !isMulti ? (defaultValue as T | undefined) : undefined
  );
  const [internalMulti, setInternalMulti] = React.useState<T[]>(
    isMulti ? (defaultValue as T[]) || [] : []
  );
  const selected = (!isMulti ? (isControlled ? (value as T) : internalSingle) : undefined) as
    | T
    | undefined;
  const selectedArray: T[] = isMulti
    ? isControlled
      ? (value as T[]) || []
      : internalMulti
    : selected !== undefined
    ? [selected]
    : [];
  const selectedSet = React.useMemo(() => new Set<T>(selectedArray), [selectedArray]);
  const popoverRef = React.useRef<PopoverRef>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = React.useState(false);

  const setSelectedSingle = React.useCallback(
    (val: T) => {
      if (!isControlled) setInternalSingle(val);
      (onChange as any)?.(val);
      if (!isMulti) popoverRef.current?.hide();
    },
    [isControlled, onChange, isMulti]
  );

  const toggleMulti = React.useCallback(
    (val: T) => {
      const has = selectedSet.has(val);
      const next = has ? selectedArray.filter((v) => v !== val) : [...selectedArray, val];
      if (!isControlled) setInternalMulti(next);
      (onChange as any)?.(next);
    },
    [isControlled, onChange, selectedArray, selectedSet]
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
      multiple: isMulti,
      selected,
      selectedSet: isMulti ? selectedSet : undefined,
      selectedValues: isMulti ? selectedArray : undefined,
      isSelected: (opt) => (isMulti ? selectedSet.has(opt.value) : opt?.value === selected),
      select: (val: T) => {
        if (isMulti) toggleMulti(val);
        else setSelectedSingle(val);
      },
      closeAfterSelect: !isMulti,
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
      isMulti,
      selected,
      selectedSet,
      selectedArray,
      setSelectedSingle,
      toggleMulti,
      triggerWidth,
    ]
  );

  const list = <SelectList style={{ maxHeight }} />;

  const content = (
    <View style={matchTriggerWidth && triggerWidth ? { width: triggerWidth * 0.9 } : undefined}>
      {list}
    </View>
  );

  const defaultTrigger = (
    <Pressable className="flex-1">
      <SelectTrigger
        placeholder={placeholder}
        className={className}
        style={style}
        matchTriggerWidth={matchTriggerWidth}
        multiple={isMulti}
        selectedLabels={
          isMulti
            ? options.filter((o: any) => selectedSet.has(o.value)).map((o: any) => o.label)
            : undefined
        }
        {...rest}
      />
    </Pressable>
  );

  const trigger = renderTrigger
    ? renderTrigger({
        open: () => popoverRef.current?.show(),
        close: () => popoverRef.current?.hide(),
        toggle: () => popoverRef.current?.toggle(),
        isOpen,
        multiple: isMulti,
        selected: selected as any,
        selectedValues: isMulti ? selectedArray : undefined,
        placeholder,
        disabled,
        displayValue: isMulti
          ? options
              .filter((o: any) => selectedSet.has(o.value))
              .map((o: any) => o.label)
              .join(', ')
          : (options.find((o: any) => o.value === selected)?.label as string) || '',
        popoverRef: popoverRef as any,
        setTriggerWidth,
      })
    : defaultTrigger;

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
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      {trigger as any}
    </Popover>
  );

  const mergedFieldProps = React.useMemo(
    () =>
      renderTrigger
        ? {
            ...fieldProps,
            containerClassName: cn(
              'border-none border-transparent rounded-none bg-transparent h-auto',
              fieldProps?.containerClassName
            ),
          }
        : fieldProps,
    [fieldProps, renderTrigger]
  );

  return (
    <SelectCtx.Provider value={ctxValue}>
      <Field
        rightSection={
          !renderTrigger ? (
            <View>
              <ChevronDown size={16} color={useColor('muted-foreground')} />
            </View>
          ) : null
        }
        {...mergedFieldProps}
      >
        {body}
      </Field>
    </SelectCtx.Provider>
  );
}
