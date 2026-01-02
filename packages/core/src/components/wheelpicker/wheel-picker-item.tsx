import * as React from 'react';
import { Pressable } from 'react-native';

import type { WheelPickerItem } from './types';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base';

type WheelPickerItemData<TValue> = WheelPickerItem<TValue>;

type WheelPickerItemProps<TValue> = {
  item: WheelPickerItemData<TValue>;
  index: number;
  itemHeight: number;
  onPress: (index: number) => void;
};

export function WheelPickerItem<TValue>({
  item,
  index,
  itemHeight,
  onPress,
}: WheelPickerItemProps<TValue>) {
  return (
    <Pressable
      disabled={item.disabled}
      className={cn('flex-row items-center justify-center  ', item.disabled && 'opacity-50')}
      style={{ height: itemHeight }}
      onPress={() => onPress(index)}
    >
      <Text className={cn('text-base text-foreground select-none')} selectable={false}>
        {item.label}
      </Text>
    </Pressable>
  );
}

export type { WheelPickerItemData, WheelPickerItemProps };
