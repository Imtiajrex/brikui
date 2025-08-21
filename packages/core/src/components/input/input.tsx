import * as React from 'react';
import { Text as RNText, TextInput as RNTextInput, View } from 'react-native';
import { cva, type VariantProps, cn } from '../../lib/utils/utils';
import { useColor } from '../../lib/hooks/useColor';

// Container (field) variants
const inputVariants = cva('flex-row items-center gap-2 rounded-input border transition-all ', {
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
});

type InputProps = Omit<React.ComponentPropsWithoutRef<typeof RNTextInput>, 'editable'> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    description?: string;
    error?: string;
    withAsterisk?: boolean;
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    // className overrides
    className?: string; // wrapper container for the whole input block
    inputClassName?: string; // text input field
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
    leftSectionClassName?: string;
    rightSectionClassName?: string;
    disabled?: boolean;
    fullWidth?: boolean;
  };

const Input = React.forwardRef<React.ComponentRef<typeof RNTextInput>, InputProps>(
  (
    {
      label,
      description,
      error,
      withAsterisk,
      leftSection,
      rightSection,
      className,
      inputClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      leftSectionClassName,
      rightSectionClassName,
      variant,
      fullWidth,
      disabled,
      placeholder,
      placeholderTextColor,
      ...props
    },
    ref
  ) => {
    const computedPlaceholder = useColor('text-muted-foreground');

    return (
      <View className={cn('w-full flex flex-col gap-1 leading-3', className)}>
        {label ? (
          <View className=" flex-row items-center gap-1">
            <RNText className={cn('text-sm font-medium text-foreground', labelClassName)}>
              {label}
            </RNText>
            {withAsterisk ? (
              <RNText accessibilityElementsHidden className="text-destructive">
                *
              </RNText>
            ) : null}
          </View>
        ) : null}

        {description ? (
          <RNText className={cn('text-xs text-muted-foreground', descriptionClassName)}>
            {description}
          </RNText>
        ) : null}

        <View className={cn(inputVariants({ variant, fullWidth, invalid: !!error, disabled }))}>
          {leftSection ? (
            <View className={cn('text-muted-foreground z-10 pl-2', leftSectionClassName)}>
              {leftSection}
            </View>
          ) : null}
          <RNTextInput
            ref={ref}
            accessibilityLabel={props.accessibilityLabel ?? label}
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor ?? computedPlaceholder}
            className={cn(
              'flex-1 w-full px-2 h-full text-foreground text-sm',
              !leftSection && 'rounded-l-input',
              !rightSection && 'rounded-r-input',
              inputClassName
            )}
            {...props}
          />
          {rightSection ? (
            <View className={cn('text-muted-foreground z-10 pr-2', rightSectionClassName)}>
              {rightSection}
            </View>
          ) : null}
        </View>

        {error ? (
          <RNText className={cn(' text-xs text-destructive', errorClassName)}>{error}</RNText>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps };
