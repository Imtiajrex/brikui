import * as React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import TimePicker, { type TimePickerProps, type TimeValue } from '../time-picker/time-picker';
import type { BaseFormFieldProps } from './types';

export interface FormTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<TimePickerProps, 'value' | 'onChange' | 'defaultValue'>,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  defaultValue?: TimeValue;
  transformIn?: (value: any) => TimeValue | undefined;
  transformOut?: (value: TimeValue | undefined) => any;
}

export function FormTimePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: FormTimePickerProps<TFieldValues, TName>) {
  const { name, control, defaultValue, transformIn, transformOut, errorMessage, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const val = transformIn ? transformIn(value) : value;
        return (
          <TimePicker
            {...rest}
            value={val}
            onChange={(v) => {
              const out = transformOut ? transformOut(v) : v;
              onChange(out);
              (rest as any).onChange?.(v);
            }}
          />
        );
      }}
    />
  );
}
