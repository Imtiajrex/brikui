import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '../../lib/utils/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);
export const useTextClass = () => React.useContext(TextClassContext);

export type TextProps = React.ComponentPropsWithoutRef<typeof RNText> & { asChild?: boolean };

const Text = React.forwardRef<RNText, TextProps>(({ className, children, ...rest }, ref) => {
  const inherited = useTextClass();
  console.log('inherited', children, inherited);
  return (
    <TextClassContext.Provider value={cn(inherited, className)}>
      <RNText
        ref={ref}
        className={cn('text-sm text-foreground leading-none', inherited, className)}
        {...rest}
      >
        {children}
      </RNText>
    </TextClassContext.Provider>
  );
});
Text.displayName = 'Text';

export { Text, TextClassContext };
