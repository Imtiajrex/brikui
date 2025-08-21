import * as React from 'react';
import { View as RNView } from 'react-native';
import { cn } from '../../lib/utils/utils';
import { TextClassContext, useTextClass } from './text';
import { renderNode } from '../../lib/utils/renderNode';
import { useExtractTextClasses } from '../../lib/hooks/useExtractTextClasses';

export type ViewProps = React.ComponentPropsWithoutRef<typeof RNView> & {
  asChild?: boolean; // reserved for future Slot support parity
  children?: React.ReactNode;
};
export type View = React.ComponentRef<typeof RNView>;

const View = React.forwardRef<React.ComponentRef<typeof RNView>, ViewProps>(
  ({ className, children, ...rest }, ref) => {
    const parent = useExtractTextClasses(className);
    return (
      <TextClassContext.Provider value={parent}>
        <RNView ref={ref} className={cn(className)} {...rest}>
          {renderNode(children)}
        </RNView>
      </TextClassContext.Provider>
    );
  }
);
View.displayName = 'View';

export { View };
