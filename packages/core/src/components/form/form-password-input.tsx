import * as React from 'react';
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form';
import { PasswordInput, type PasswordInputProps } from '../password-input';
import type { BaseFormFieldProps } from './types';

export interface FormPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<PasswordInputProps, 'value' | 'onChange' | 'defaultValue'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  defaultValue?: any;
  transformIn?: (value: any) => any;
  transformOut?: (value: any) => any;
}

export function FormPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: FormPasswordInputProps<TFieldValues, TName>) {
  const { name, control, defaultValue, transformIn, transformOut, errorMessage, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
        <PasswordInput
          {...rest}
          ref={ref as any}
          // PasswordInput uses Input under the hood so value/onChangeText propagate
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
