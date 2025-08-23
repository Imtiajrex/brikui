import * as React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { SelectRootInner } from '../select/select-root';
import type { SelectProps, MultiSelectProps, SelectOption } from '../select/types';
import type { BaseFormFieldProps } from './types';

// Unified props allowing generics for single or multi
export interface FormSelectSingleProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue = any
> extends Omit<SelectProps<TValue>, 'value' | 'onChange' | 'defaultValue'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  multiple?: false;
  defaultValue?: TValue;
  transformIn?: (value: any) => TValue | undefined;
  transformOut?: (value: TValue | undefined) => any;
}

export interface FormSelectMultiProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue = any
> extends Omit<MultiSelectProps<TValue>, 'value' | 'onChange' | 'defaultValue'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  multiple: true;
  defaultValue?: TValue[];
  transformIn?: (value: any) => TValue[] | undefined;
  transformOut?: (value: TValue[] | undefined) => any;
}

export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue = any
> =
  | FormSelectSingleProps<TFieldValues, TName, TValue>
  | FormSelectMultiProps<TFieldValues, TName, TValue>;

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue = any
>(props: FormSelectProps<TFieldValues, TName, TValue>) {
  const {
    name,
    control,
    defaultValue,
    transformIn,
    transformOut,
    errorMessage,
    multiple,
    ...rest
  } = props as any;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const val = transformIn ? transformIn(value) : value;
        return (
          <SelectRootInner
            {...rest}
            multiple={multiple}
            value={val}
            onChange={(v: any) => {
              const out = transformOut ? transformOut(v) : v;
              onChange(out);
              rest.onChange?.(v);
            }}
            fieldProps={{
              ...(rest.fieldProps || {}),
              error: errorMessage ?? error?.message,
            }}
          />
        );
      }}
    />
  );
}
