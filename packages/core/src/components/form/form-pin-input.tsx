import * as React from 'react';
import { Controller, type FieldValues, type Path, type Control } from 'react-hook-form';
import { PinInput, type PinInputProps } from '../pin-input';
import type { BaseFormFieldProps } from './types';

export interface FormPinInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<PinInputProps, 'value' | 'onChange' | 'defaultValue' | 'onComplete'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  defaultValue?: any;
  transformIn?: (value: any) => any;
  transformOut?: (value: any) => any;
  onComplete?: (value: string) => void; // user callback after fill
}

export function FormPinInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: FormPinInputProps<TFieldValues, TName>) {
  const {
    name,
    control,
    defaultValue,
    transformIn,
    transformOut,
    errorMessage,
    onComplete,
    ...rest
  } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <PinInput
          {...(rest as any)}
          ref={ref as any}
          value={transformIn ? transformIn(value) : value}
          onChange={(val) => {
            const v = transformOut ? transformOut(val) : val;
            onChange(v);
            rest.onChange?.(v as any);
          }}
          onComplete={(val) => {
            onComplete?.(val);
            // ensure final value in form is synced (already happens via onChange but safeguard)
            const v = transformOut ? transformOut(val) : val;
            onChange(v);
          }}
        />
      )}
    />
  );
}
