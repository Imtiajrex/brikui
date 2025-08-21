import * as React from 'react';
import { Platform } from 'react-native';
import { Text } from '../base/text';
import { View } from '../base/view';
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
          <Text className={cn('text-sm font-medium text-foreground leading-none', labelClassName)}>
            {label}
          </Text>
          {withAsterisk ? (
            <Text accessibilityElementsHidden className="text-destructive leading-none">
              *
            </Text>
          ) : null}
        </View>
      ) : null}

      {description ? (
        <Text className={cn('text-xs text-muted-foreground leading-none', descriptionClassName)}>
          {description}
        </Text>
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
        <Text className={cn('text-xs text-destructive leading-none', errorClassName)}>{error}</Text>
      ) : null}
    </View>
  );
};

Field.displayName = 'Field';

export { Field };
export type { FieldProps };
