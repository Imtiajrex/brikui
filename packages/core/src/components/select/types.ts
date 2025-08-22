import { ViewStyle, Pressable } from 'react-native';
import * as React from 'react';
import { FieldProps } from '../field/field';
import { PopoverRef } from '../popover/popover';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface BaseSelectCommon<T = any> {
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  optionClassName?: string;
  optionTextClassName?: string;
  selectedClassName?: string;
  maxHeight?: number;
  renderOption?: (opt: SelectOption<T>, selected: boolean) => React.ReactNode;
  showIndicator?: boolean;
  indicator?: React.ReactNode;
  matchTriggerWidth?: boolean;
}

export interface SelectProps<T = any>
  extends Omit<React.ComponentProps<typeof Pressable>, 'onChange' | 'disabled'>,
    BaseSelectCommon<T> {
  value?: T; // controlled (single)
  defaultValue?: T;
  onChange?: (value: T) => void;
  fieldProps?: Omit<FieldProps, 'children'>;
  popoverClassName?: string;
  popoverContentClassName?: string;
  style?: ViewStyle;
  multiple?: false; // placeholder for future multi
  disabled?: boolean;
}

export interface SelectContextValue<T = any> extends BaseSelectCommon<T> {
  multiple: boolean;
  selected?: T; // single
  selectedSet?: Set<T>; // multi future
  isSelected: (opt: SelectOption<T>) => boolean;
  select: (val: T) => void;
  closeAfterSelect: boolean;
  popoverRef: React.RefObject<PopoverRef>;
  triggerWidth?: number;
  setTriggerWidth: (w: number) => void;
}
