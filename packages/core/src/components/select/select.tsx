import { SelectRootInner } from './select-root';
import { SelectProps } from './types';

export function Select<T = any>(props: SelectProps<T>) {
  return <SelectRootInner<T> {...props} />;
}
Select.displayName = 'Select';

export * from './types';
export * from './context';
export * from './option';
export * from './list';
export * from './trigger';
