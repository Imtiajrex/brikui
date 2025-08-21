import * as React from 'react';
import { Popable, usePopable } from 'react-native-popable';
import { View } from '../base/view';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';
import { useColor } from '../../lib/hooks/useColor';

// Minimal prop subset wrapper; Popable's own props are untyped here for flexibility.
export interface PopoverProps {
  content: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: 'press' | 'longpress' | 'hover';
  visible?: boolean; // controlled
  onAction?: (visible: boolean) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  strictPosition?: boolean;
  numberOfLines?: number;
  // any additional props forwarded
  [key: string]: any;
}

const Popover = React.forwardRef<any, PopoverProps>((props, ref) => {
  const { title, description, content, ...rest } = props;
  const composed = (
    <View className={cn('gap-2 bg-background w-full p-3 border border-border rounded-radius')}>
      {(title || description) && (
        <View className="gap-1">
          {title &&
            (typeof title === 'string' ? (
              <Text className="font-semibold text-xs">{title}</Text>
            ) : (
              title
            ))}
          {description &&
            (typeof description === 'string' ? (
              <Text className="text-[11px] text-foreground leading-tight">{description}</Text>
            ) : (
              description
            ))}
        </View>
      )}
      {content}
    </View>
  );
  return (
    <Popable ref={ref} backgroundColor={'transparent'} content={composed} {...rest}>
      {rest.children}
    </Popable>
  );
});
Popover.displayName = 'Popover';

export { Popover, usePopable };
