import type { FieldValues, Path } from 'react-hook-form';

// Generic helper props for form controlled components
export interface BaseFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> {
  name: TName;
  control: any; // using any to avoid forcing user to import specific Control<T>
  // Optional: override value & onChange if custom behavior (will override RHF injected)
  value?: any;
  onChange?: (value: any) => void;
  // Optional: error message override
  errorMessage?: string;
}
