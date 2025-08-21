import * as React from 'react';
import { Platform, View, Text as RNText } from 'react-native';
import { cn } from '../../lib/utils/utils';

type FieldProps = {
  label?: string;
  description?: string;
  error?: string;
  withAsterisk?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  focused?: boolean;
  className?: string; // full wrapper
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  containerClassName?: string; // input container row (receives variants from control)
  focusClassName?: string; // optional override applied when focused
  children?: React.ReactNode; // actual input row content
};

const Field = ({
  label,
  description,
  error,
  withAsterisk,
  disabled,
  invalid,
  focused,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  containerClassName,
  focusClassName,
  children,
}: FieldProps) => {
  const isInvalid = Boolean(invalid ?? error);

  const focusRingWeb = isInvalid
    ? 'ring-2 ring-destructive ring-offset-2 ring-offset-background border-destructive'
    : 'ring-2 ring-ring ring-offset-2 ring-offset-background border-ring';
  const focusBorderNative = isInvalid ? ' border-destructive' : ' border-ring';

  return (
    <View className={cn('w-full flex flex-col gap-1.5', className)}>
      {label ? (
        <View className="flex-row items-center gap-1">
          <RNText
            className={cn('text-sm font-medium text-foreground leading-none', labelClassName)}
          >
            {label}
          </RNText>
          {withAsterisk ? (
            <RNText accessibilityElementsHidden className="text-destructive leading-none">
              *
            </RNText>
          ) : null}
        </View>
      ) : null}

      {description ? (
        <RNText className={cn('text-xs text-muted-foreground leading-none', descriptionClassName)}>
          {description}
        </RNText>
      ) : null}

      <View
        className={cn(
          containerClassName,
          isInvalid && 'border-destructive',
          focused &&
            !disabled &&
            (focusClassName ?? (Platform.OS === 'web' ? focusRingWeb : focusBorderNative))
        )}
      >
        {children}
      </View>

      {error ? (
        <RNText className={cn('text-xs text-destructive leading-none', errorClassName)}>
          {error}
        </RNText>
      ) : null}
    </View>
  );
};

Field.displayName = 'Field';

export { Field };
export type { FieldProps };
