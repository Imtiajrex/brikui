import * as React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { View } from '../base/view';
import { type VariantProps, cn } from '../../lib/utils/utils';
import { useColor } from '../../lib/hooks/useColor';
import { Field, fieldContainerVariants, FieldProps } from '../field';

// Alias to preserve previous API name; now delegates to fieldContainerVariants
const inputVariants = fieldContainerVariants;

type InputProps = Omit<React.ComponentPropsWithoutRef<typeof RNTextInput>, 'editable'> &
  VariantProps<typeof inputVariants> &
  FieldProps & {
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
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const computedPlaceholder = useColor('text-muted-foreground');
    const [focused, setFocused] = React.useState(false);
    return (
      <Field
        className={className}
        label={label}
        description={description}
        error={error}
        withAsterisk={withAsterisk}
        disabled={disabled}
        invalid={!!error}
        focused={focused}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
        errorClassName={errorClassName}
        variant={variant}
        fullWidth={fullWidth}
        size={props.size as any}
        leftSection={leftSection}
        rightSection={rightSection}
        leftSectionClassName={leftSectionClassName}
        rightSectionClassName={rightSectionClassName}
        {...props}
      >
        <RNTextInput
          ref={ref}
          accessibilityLabel={props.accessibilityLabel ?? label}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? computedPlaceholder}
          onFocus={(e: any) => {
            if (!disabled) setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e: any) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'flex-1 w-full px-2 h-full text-foreground text-sm',
            !leftSection && 'rounded-l-input',
            !rightSection && 'rounded-r-input',
            inputClassName
          )}
          {...props}
        />
      </Field>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps };
