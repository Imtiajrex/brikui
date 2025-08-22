import * as React from 'react';
import WheelPickerBase from '@quidone/react-native-wheel-picker';
import { View } from '../base/view';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';

// Public API kept index-based for simplicity; internally maps to library's value API
export interface WheelPickerProps {
  options: (string | number)[];
  value?: number; // index (controlled)
  defaultValue?: number; // index (uncontrolled)
  onChange?: (index: number, value: string | number) => void;
  itemClassName?: string;
  activeItemClassName?: string;
  containerClassName?: string;
  height?: number; // overall height constraint (optional)
  itemHeight?: number; // each row height
  enableScrollByTapOnItem?: boolean;
  visibleItemCount?: number; // override derived visible items (must be odd)
  renderItem?: (value: string | number, active: boolean, index: number) => React.ReactNode;
  overlayClassName?: string; // customize selection overlay lines
}

export const WheelPicker = React.forwardRef<any, WheelPickerProps>(
  (
    {
      options,
      value,
      defaultValue = 0,
      onChange,
      itemClassName,
      activeItemClassName = 'text-primary font-semibold',
      containerClassName,
      height,
      itemHeight = 36,
      enableScrollByTapOnItem = true,
      visibleItemCount,
      renderItem,
      overlayClassName,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalIndex, setInternalIndex] = React.useState(defaultValue);
    const index = isControlled ? value! : internalIndex;

    // Build data objects expected by library
    const data = React.useMemo(
      () =>
        options.map((opt, i) => ({
          value: i,
          label: String(opt),
          _raw: opt,
        })),
      [options]
    );

    // Derive visibleItemCount from height & itemHeight if not provided
    const derivedVisible = React.useMemo(() => {
      if (visibleItemCount && visibleItemCount % 2 === 1) return visibleItemCount;
      if (height) {
        const approx = Math.max(1, Math.floor(height / itemHeight));
        return approx % 2 === 1 ? approx : Math.max(1, approx - 1);
      }
      return 5; // default
    }, [visibleItemCount, height, itemHeight]);

    const pickerHeight = React.useMemo(
      () => (height ? height : derivedVisible * itemHeight),
      [height, derivedVisible, itemHeight]
    );

    const handleValueChanged = (e: any) => {
      // Support different shapes across platforms
      const item = e?.item ?? e; // some builds might send item directly
      let derivedIndex: number | undefined = undefined;
      if (typeof item?.value === 'number') derivedIndex = item.value;
      else if (typeof e?.value === 'number') derivedIndex = e.value;
      // Fallback: locate by label text
      if (derivedIndex === undefined && item?.label != null) {
        const lbl = String(item.label);
        const found = options.findIndex((o) => String(o) === lbl);
        if (found >= 0) derivedIndex = found;
      }
      if (derivedIndex === undefined) derivedIndex = 0;
      if (derivedIndex < 0 || derivedIndex >= options.length) derivedIndex = 0;
      if (!isControlled) setInternalIndex(derivedIndex);
      onChange?.(derivedIndex, options[derivedIndex]);
    };

    const renderOverlay = () => (
      <View
        pointerEvents="none"
        className={cn('absolute left-0 right-0 border-y border-border', overlayClassName)}
        style={{ top: (pickerHeight - itemHeight) / 2, height: itemHeight }}
      />
    );

    return (
      <View
        className={cn('relative items-stretch', containerClassName)}
        style={{ height: pickerHeight }}
      >
        <WheelPickerBase
          data={data}
          value={index}
          itemHeight={itemHeight}
          visibleItemCount={derivedVisible}
          enableScrollByTapOnItem={enableScrollByTapOnItem}
          onValueChanged={handleValueChanged}
          renderItem={(params: any) => {
            const i = params?.index ?? params?.item?.value ?? 0;
            const active = i === index;
            return renderItem ? (
              renderItem(options[i], active, i)
            ) : (
              <Text
                className={cn(
                  'text-sm text-foreground text-center mt-2',
                  itemClassName,
                  active && activeItemClassName
                )}
              >
                {options[i] + ''}
              </Text>
            );
          }}
          {...rest}
        />
      </View>
    );
  }
);

WheelPicker.displayName = 'WheelPicker';
