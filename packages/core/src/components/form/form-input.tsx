import * as React from 'react';
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form';
import { Input, type InputProps } from '../input';
import type { BaseFormFieldProps } from './types';

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<InputProps, 'value' | 'onChange' | 'defaultValue'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  defaultValue?: any;
  transformIn?: (value: any) => any; // adapt stored value -> input
  transformOut?: (value: any) => any; // adapt input -> stored value
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: FormInputProps<TFieldValues, TName>) {
  const { name, control, defaultValue, transformIn, transformOut, errorMessage, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
        <Input
          {...rest}
          ref={ref as any}
          value={transformIn ? transformIn(value) : value}
          onBlur={onBlur}
          onChangeText={(txt) => {
            const v = transformOut ? transformOut(txt) : txt;
            onChange(v);
            rest.onChange?.(v as any);
          }}
          error={errorMessage ?? error?.message}
        />
      )}
    />
  );
}
