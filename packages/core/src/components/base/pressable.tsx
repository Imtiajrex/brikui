import * as React from 'react';
import { Pressable as RNPressable, PressableStateCallbackType } from 'react-native';
import { cn } from '../../lib/utils/utils';
import { TextClassContext, useTextClass } from './text';
import { renderNode } from '../../lib/utils/renderNode';
import { useExtractTextClasses } from '../../lib/hooks/useExtractTextClasses';

export type PressableProps = React.ComponentPropsWithoutRef<typeof RNPressable> & {
  asChild?: boolean; // reserved for future Slot support
  children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
};

const Pressable = React.forwardRef<React.ComponentRef<typeof RNPressable>, PressableProps>(
  ({ className, children, ...rest }, ref) => {
    const parent = useExtractTextClasses(className);
    return (
      <TextClassContext.Provider value={parent}>
        <RNPressable ref={ref} className={cn(className)} {...rest}>
          {typeof children === 'function'
            ? (state: PressableStateCallbackType) => renderNode(children(state))
            : renderNode(children)}
        </RNPressable>
      </TextClassContext.Provider>
    );
  }
);
Pressable.displayName = 'Pressable';

export { Pressable };
