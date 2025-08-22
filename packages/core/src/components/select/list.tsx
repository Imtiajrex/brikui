import * as React from 'react';
import { FlatList } from 'react-native';
import { useSelectContext } from './context';
import { SelectOptionItem } from './option';
import { SelectOption } from './types';

export interface SelectListProps<T> {
  options?: SelectOption<T>[];
  style?: any;
}
export function SelectList<T>({ options, style }: SelectListProps<T>) {
  const ctx = useSelectContext<T>();
  const data = options ?? ctx.options;
  return (
    <FlatList
      data={data as any[]}
      keyExtractor={(i: any) => (i.value as any)?.toString?.() ?? i.label}
      renderItem={({ item, index }: any) => <SelectOptionItem option={item} index={index} />}
      style={style}
      contentContainerStyle={{ paddingVertical: 4 }}
    />
  );
}
