import * as React from 'react';
import { Pressable } from 'react-native';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';
import { useSelectContext } from './context';
import { SelectOption as Opt } from './types';

export interface SelectOptionItemProps<T> {
  option: Opt<T>;
  index: number;
}

export function SelectOptionItem<T>({ option }: SelectOptionItemProps<T>) {
  const {
    isSelected,
    select,
    disabled,
    optionClassName,
    optionTextClassName,
    selectedClassName = 'bg-background',
    renderOption,
    showIndicator = true,
    indicator,
  } = useSelectContext<T>();

  const selected = isSelected(option);
  const disabledOpt = disabled || option.disabled;
  return (
    <Pressable
      key={(option.value as any)?.toString?.() ?? option.label}
      disabled={disabledOpt}
      onPress={() => select(option.value)}
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
        renderOption(option, selected)
      ) : (
        <Text className={cn('text-sm', optionTextClassName)}>{option.label}</Text>
      )}
      {showIndicator &&
        selected &&
        (indicator ?? <Text className="text-xs text-muted-foreground">✓</Text>)}
    </Pressable>
  );
}
