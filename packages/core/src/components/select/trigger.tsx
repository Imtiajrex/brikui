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
}
export const SelectTrigger = React.forwardRef<View, SelectTriggerProps>(
  ({ placeholder, className, matchTriggerWidth = true, style, ...rest }, ref) => {
    const { selected, options, disabled, popoverRef, setTriggerWidth } = useSelectContext<any>();
    const triggerRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => triggerRef.current as any, []);
    const selectedOption = options.find((o) => o.value === selected);
    return (
      <Pressable
        ref={triggerRef}
        className={cn(
          'flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 min-h-10',
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
        <Text
          className={cn(
            'text-sm text-foreground flex-1',
            !selectedOption && 'text-muted-foreground'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="ml-2 text-xs text-muted-foreground">▾</Text>
      </Pressable>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';
