import * as React from 'react';
import { Platform } from 'react-native';
import { Text } from '../base/text';
import { View } from '../base/view';
import { cva, type VariantProps, cn } from '../../lib/utils/utils';

// Reusable container variants (moved from input component so other controls can share)
const fieldContainerVariants = cva(
  'flex-row items-center gap-2 rounded-input border transition-all border-input overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        filled: 'bg-muted border-transparent',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      invalid: {
        true: 'border-destructive',
        false: '',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
      size: {
        sm: 'h-9',
        default: 'h-10',
        lg: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      fullWidth: true,
      invalid: false,
      disabled: false,
      size: 'default',
    },
  }
);

type FieldProps = VariantProps<typeof fieldContainerVariants> & {
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
  containerClassName?: string; // extra classes for the interactive row
  focusClassName?: string; // optional override applied when focused
  children?: React.ReactNode; // actual input row content
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSectionClassName?: string;
  rightSectionClassName?: string;
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
  variant,
  fullWidth,
  size,
  leftSection,
  rightSection,
  leftSectionClassName,
  rightSectionClassName,
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
          fieldContainerVariants({
            variant,
            fullWidth,
            size,
            invalid: isInvalid,
            disabled,
          }),
          containerClassName,
          focused &&
            !disabled &&
            (focusClassName ?? (Platform.OS === 'web' ? focusRingWeb : focusBorderNative))
        )}
      >
        {leftSection ? (
          <View className={cn('text-muted-foreground z-10 pl-2', leftSectionClassName)}>
            {leftSection}
          </View>
        ) : null}
        {children}
        {rightSection ? (
          <View className={cn('text-muted-foreground z-10 pr-2', rightSectionClassName)}>
            {rightSection}
          </View>
        ) : null}
      </View>

      {error ? (
        <Text className={cn('text-xs text-destructive leading-none', errorClassName)}>{error}</Text>
      ) : null}
    </View>
  );
};

Field.displayName = 'Field';

export { Field, fieldContainerVariants };
export type { FieldProps };
