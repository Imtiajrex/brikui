import * as React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';
import { useSelectContext } from './context';

export interface SelectTriggerProps extends React.ComponentProps<typeof Pressable> {
  placeholder?: string;
  className?: string;
  matchTriggerWidth?: boolean;
  style?: ViewStyle;
  multiple?: boolean;
  selectedLabels?: string[]; // for multi
  maxTagCount?: number; // display limit before summarizing
  renderMultipleLabel?: (labels: string[]) => string;
}
export const SelectTrigger = React.forwardRef<View, SelectTriggerProps>(
  (
    {
      placeholder,
      className,
      matchTriggerWidth = true,
      style,
      multiple,
      selectedLabels,
      maxTagCount = 3,
      renderMultipleLabel,
      ...rest
    },
    ref
  ) => {
    const { selected, options, disabled, popoverRef, setTriggerWidth } = useSelectContext<any>();
    const triggerRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => triggerRef.current as any, []);
    const selectedOption = options.find((o) => o.value === selected);
    let display: string | undefined;
    if (multiple) {
      const labels = selectedLabels || [];
      if (renderMultipleLabel) display = renderMultipleLabel(labels);
      else if (!labels.length) display = undefined;
      else if (labels.length <= maxTagCount) display = labels.join(', ');
      else display = `${labels.slice(0, maxTagCount).join(', ')} +${labels.length - maxTagCount}`;
    } else {
      display = selectedOption?.label;
    }
    return (
      <Pressable
        ref={triggerRef}
        className={cn(
          'flex-row flex-1 items-center justify-between rounded-input bg-background px-2 min-h-10',
          disabled && 'opacity-50',
          className
        )}
        style={style}
        onLayout={(e) => {
          if (matchTriggerWidth) setTriggerWidth(e.nativeEvent.layout.width);
        }}
        onPress={() => popoverRef.current?.show()}
        accessibilityRole="button"
        {...rest}
      >
        <Text className={cn('text-sm text-foreground flex-1', !display && 'text-muted-foreground')}>
          {display ?? placeholder}
        </Text>
      </Pressable>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';
