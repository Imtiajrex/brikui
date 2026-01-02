import * as React from 'react';
import { View as RNView } from 'react-native';
import { cn } from '../../lib/utils/utils';
import { TextClassContext, useTextClass } from './text';
import { renderNode } from '../../lib/utils/renderNode';
import { useExtractTextClasses } from '../../lib/hooks/useExtractTextClasses';

export type ViewProps = React.ComponentPropsWithoutRef<typeof RNView> & {
  className?: string;
  asChild?: boolean; // reserved for future Slot support parity
  children?: React.ReactNode;
};
export type View = React.ComponentRef<typeof RNView>;

type RNViewWithClassName = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.ComponentPropsWithoutRef<typeof RNView> & { className?: string }> &
    React.RefAttributes<React.ComponentRef<typeof RNView>>
>;

const BaseView = RNView as unknown as RNViewWithClassName;

const View = React.forwardRef<React.ComponentRef<typeof RNView>, ViewProps>(
  ({ className, children, ...rest }, ref) => {
    const parent = useExtractTextClasses(className);
    return (
      <TextClassContext.Provider value={parent}>
        <BaseView ref={ref} className={cn(className)} {...rest}>
          {renderNode(children)}
        </BaseView>
      </TextClassContext.Provider>
    );
  }
);
View.displayName = 'View';

export { View };
