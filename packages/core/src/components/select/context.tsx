import * as React from 'react';
import { SelectContextValue } from './types';

export const SelectCtx = React.createContext<SelectContextValue<any> | null>(null);
export const useSelectContext = <T,>() => {
  const ctx = React.useContext(SelectCtx);
  if (!ctx) throw new Error('Select primitives must be used within <SelectRoot>');
  return ctx as SelectContextValue<T>;
};
