import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '../../lib/utils/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);
export const useTextClass = () => React.useContext(TextClassContext);

export type TextProps = React.ComponentPropsWithoutRef<typeof RNText> & {
  className?: string;
  asChild?: boolean;
};

type RNTextWithClassName = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.ComponentPropsWithoutRef<typeof RNText> & { className?: string }> &
    React.RefAttributes<React.ComponentRef<typeof RNText>>
>;

const BaseText = RNText as unknown as RNTextWithClassName;

const Text = React.forwardRef<RNText, TextProps>(({ className, children, ...rest }, ref) => {
  const inherited = useTextClass();
  return (
    <TextClassContext.Provider value={cn(inherited, className)}>
      <BaseText
        ref={ref}
        className={cn('text-sm text-foreground leading-none', inherited, className)}
        {...rest}
      >
        {children}
      </BaseText>
    </TextClassContext.Provider>
  );
});
Text.displayName = 'Text';

export { Text, TextClassContext };
