import * as React from 'react';
import { PressableStateCallbackType, Pressable as RNPressable } from 'react-native';
import { useExtractTextClasses } from '../../lib/hooks/useExtractTextClasses';
import { renderNode } from '../../lib/utils/renderNode';
import { cn } from '../../lib/utils/utils';
import { TextClassContext } from './text';

type RNPressableWithClassName = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    React.ComponentPropsWithoutRef<typeof RNPressable> & { className?: string }
  > &
    React.RefAttributes<React.ComponentRef<typeof RNPressable>>
>;

const BasePressable = RNPressable as RNPressableWithClassName;

export type PressableProps = React.ComponentPropsWithoutRef<typeof RNPressable> & {
  className?: string;
  asChild?: boolean; // reserved for future Slot support
  children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
};

const Pressable = React.forwardRef<React.ComponentRef<typeof RNPressable>, PressableProps>(
  ({ className, children, ...rest }, ref) => {
    const parent = useExtractTextClasses(className);
    return (
      <TextClassContext.Provider value={parent}>
        <BasePressable ref={ref} className={cn(className)} {...rest}>
          {typeof children === 'function'
            ? (state: PressableStateCallbackType) => renderNode(children(state))
            : renderNode(children)}
        </BasePressable>
      </TextClassContext.Provider>
    );
  }
);
Pressable.displayName = 'Pressable';

export { Pressable };
