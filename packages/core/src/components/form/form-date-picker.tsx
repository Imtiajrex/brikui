import * as React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import DatePicker, { type DatePickerProps } from '../date-picker/date-picker';
import type { BaseFormFieldProps } from './types';

export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<
      DatePickerProps,
      | 'value'
      | 'rangeValue'
      | 'values'
      | 'defaultValue'
      | 'defaultRangeValue'
      | 'defaultValues'
      | 'onChange'
    >,
    BaseFormFieldProps<TFieldValues, TName> {
  control: Control<TFieldValues>;
  defaultValue?: any; // depends on mode
  mode?: 'single' | 'range' | 'multiple';
  transformIn?: (value: any) => any;
  transformOut?: (value: any) => any;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(props: FormDatePickerProps<TFieldValues, TName>) {
  const {
    name,
    control,
    defaultValue,
    errorMessage,
    transformIn,
    transformOut,
    mode = 'single',
    ...rest
  } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const val = transformIn ? transformIn(value) : value;
        const onPickerChange = (payload: any) => {
          let storeVal: any;
          if (mode === 'single') storeVal = payload.date;
          else if (mode === 'range')
            storeVal = { startDate: payload.startDate, endDate: payload.endDate };
          else storeVal = payload.dates;
          const out = transformOut ? transformOut(storeVal) : storeVal;
          onChange(out);
          (rest as any).onChange?.(storeVal);
        };
        const pickerProps: any = {};
        if (mode === 'single') pickerProps.value = val;
        else if (mode === 'range') pickerProps.rangeValue = val;
        else if (mode === 'multiple') pickerProps.values = val;
        return (
          <DatePicker
            mode={mode}
            {...rest}
            {...pickerProps}
            onChange={onPickerChange}
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
