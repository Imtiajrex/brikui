import { SelectRootInner } from './select-root';
import { SelectProps, MultiSelectProps } from './types';

export function Select<T = any>(props: SelectProps<T>) {
  return <SelectRootInner<T> {...props} />;
}
Select.displayName = 'Select';

export function MultiSelect<T = any>(props: Omit<MultiSelectProps<T>, 'multiple'>) {
  return <SelectRootInner<T> {...(props as any)} multiple />;
}
MultiSelect.displayName = 'MultiSelect';

export * from './types';
export * from './context';
export * from './option';
export * from './list';
export * from './trigger';
