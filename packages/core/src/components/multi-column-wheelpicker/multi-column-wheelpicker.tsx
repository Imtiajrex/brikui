import * as React from 'react';
import { View } from 'react-native';

import { WheelPicker, type WheelPickerItem } from '../wheelpicker';
import { cn } from '../../lib/utils/utils';

type MultiColumnWheelPickerColumn<TValue = unknown> = {
  key?: string;
  items: Array<WheelPickerItem<TValue>>;
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue, index: number) => void;
  itemHeight?: number;
  visibleItems?: number;
  hapticFeedback?: boolean;
  className?: string;
  overlayBgColorClassName?: string;
};

type ColumnValue<TColumn> = TColumn extends MultiColumnWheelPickerColumn<infer TValue>
  ? TValue
  : never;

type ColumnChangePayload<TColumn> = {
  columnIndex: number;
  value: ColumnValue<TColumn>;
  index: number;
};

type MultiColumnWheelPickerProps<
  TColumns extends ReadonlyArray<MultiColumnWheelPickerColumn<any>> = ReadonlyArray<
    MultiColumnWheelPickerColumn<any>
  >
> = {
  columns: TColumns;
  onChange?: (payload: ColumnChangePayload<TColumns[number]>) => void;
  itemHeight?: number;
  visibleItems?: number;
  hapticFeedback?: boolean;
  className?: string;
  columnClassName?: string;
  overlayBgColorClassName?: string;
  gap?: number;
};

type ColumnDefaults = {
  itemHeight: number;
  visibleItems: number;
  hapticFeedback?: boolean;
  columnClassName?: string;
  overlayBgColorClassName?: string;
  gap: number;
};

type ColumnProps<TColumn extends MultiColumnWheelPickerColumn<any>> = {
  column: TColumn;
  columnIndex: number;
  totalColumns: number;
  defaults: ColumnDefaults;
  onChange?: (payload: ColumnChangePayload<TColumn>) => void;
  key?: React.Key;
};

function WheelPickerColumnInner<TColumn extends MultiColumnWheelPickerColumn<any>>({
  column,
  columnIndex,
  totalColumns,
  defaults,
  onChange,
}: ColumnProps<TColumn>) {
  const {
    itemHeight: defaultItemHeight,
    visibleItems: defaultVisibleItems,
    hapticFeedback: defaultHaptics,
    columnClassName,
    overlayBgColorClassName,
    gap,
  } = defaults;

  const resolvedItemHeight = column.itemHeight ?? defaultItemHeight;
  const resolvedVisibleItems = column.visibleItems ?? defaultVisibleItems;
  const resolvedHaptics = column.hapticFeedback ?? defaultHaptics;
  const resolvedOverlayBg = column.overlayBgColorClassName ?? overlayBgColorClassName;

  const marginRight = React.useMemo(
    () => (columnIndex === totalColumns - 1 ? 0 : Math.max(0, gap)),
    [columnIndex, gap, totalColumns]
  );

  const handleValueChange = React.useCallback(
    (value: ColumnValue<TColumn>, index: number) => {
      column.onValueChange?.(value, index);
      onChange?.({ columnIndex, value, index });
    },
    [column.onValueChange, columnIndex, onChange]
  );

  const mergedClassName = React.useMemo(
    () => cn(columnClassName, column.className),
    [column.className, columnClassName]
  );

  return (
    <View className="flex-1">
      <WheelPicker
        items={column.items}
        value={column.value}
        defaultValue={column.defaultValue}
        onValueChange={handleValueChange}
        itemHeight={resolvedItemHeight}
        visibleItems={resolvedVisibleItems}
        hapticFeedback={resolvedHaptics}
        className={mergedClassName}
        overlayBgColorClassName={resolvedOverlayBg}
      />
    </View>
  );
}

const WheelPickerColumn = React.memo(WheelPickerColumnInner, (prev, next) => {
  return (
    prev.column === next.column &&
    prev.columnIndex === next.columnIndex &&
    prev.totalColumns === next.totalColumns &&
    prev.defaults.itemHeight === next.defaults.itemHeight &&
    prev.defaults.visibleItems === next.defaults.visibleItems &&
    prev.defaults.hapticFeedback === next.defaults.hapticFeedback &&
    prev.defaults.columnClassName === next.defaults.columnClassName &&
    prev.defaults.overlayBgColorClassName === next.defaults.overlayBgColorClassName &&
    prev.defaults.gap === next.defaults.gap &&
    prev.onChange === next.onChange
  );
}) as <TColumn extends MultiColumnWheelPickerColumn<any>>(
  props: ColumnProps<TColumn>
) => React.JSX.Element;

function MultiColumnWheelPicker<TColumns extends ReadonlyArray<MultiColumnWheelPickerColumn<any>>>({
  columns,
  onChange,
  itemHeight = 44,
  visibleItems = 5,
  hapticFeedback,
  className,
  columnClassName,
  overlayBgColorClassName,
  gap = 12,
}: MultiColumnWheelPickerProps<TColumns>) {
  const defaults = React.useMemo(
    () => ({
      itemHeight,
      visibleItems,
      hapticFeedback,
      columnClassName,
      overlayBgColorClassName,
      gap,
    }),
    [columnClassName, gap, hapticFeedback, itemHeight, overlayBgColorClassName, visibleItems]
  );

  const handleChange = React.useCallback(
    (payload: ColumnChangePayload<TColumns[number]>) => {
      onChange?.(payload);
    },
    [onChange]
  );

  return (
    <View className={cn('flex-row ', className)}>
      {columns.map((column, columnIndex) => (
        <WheelPickerColumn
          key={column.key ?? columnIndex}
          column={column}
          columnIndex={columnIndex}
          totalColumns={columns.length}
          defaults={defaults}
          onChange={handleChange}
        />
      ))}
    </View>
  );
}

const MemoizedMultiColumnWheelPicker = React.memo(
  MultiColumnWheelPicker
) as typeof MultiColumnWheelPicker;

export { MemoizedMultiColumnWheelPicker as MultiColumnWheelPicker };
export type { MultiColumnWheelPickerColumn, MultiColumnWheelPickerProps };
