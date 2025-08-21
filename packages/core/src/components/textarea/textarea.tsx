import * as React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { cn } from '../../lib/utils/utils';
import { useColor } from '../../lib/hooks/useColor';
import { Field } from '../field';
import { inputVariants } from '../input';
import type { InputProps } from '../input';

type BaseOmitted = 'leftSection' | 'rightSection' | 'secureTextEntry';

type TextareaProps = Omit<InputProps, BaseOmitted> & {
  rows?: number; // default numberOfLines
  autoGrow?: boolean; // grows with content size
};

const Textarea = React.forwardRef<React.ComponentRef<typeof RNTextInput>, TextareaProps>(
  (
    {
      className,
      inputClassName,
      label,
      description,
      error,
      withAsterisk,
      disabled,
      variant,
      fullWidth,
      placeholder,
      placeholderTextColor,
      rows,
      autoGrow = true,
      labelClassName,
      descriptionClassName,
      errorClassName,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const computedPlaceholder = useColor('text-muted-foreground');
    const [focused, setFocused] = React.useState(false);
    const baseRowHeight = 20; // approx for text-sm
    const verticalPadding = 16; // py-2 on input
    const minHeight = rows ? rows * baseRowHeight + verticalPadding : undefined;
    const [height, setHeight] = React.useState<number | undefined>(minHeight);

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
        containerClassName={cn(
          inputVariants({ variant, fullWidth, invalid: !!error, disabled }),
          'items-start h-auto'
        )}
      >
        <RNTextInput
          ref={ref}
          multiline
          numberOfLines={rows}
          editable={!disabled}
          accessibilityLabel={props.accessibilityLabel ?? label}
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
          onContentSizeChange={(e) => {
            if (autoGrow) {
              const next = e.nativeEvent.contentSize.height;
              setHeight((prev) => Math.max(minHeight ?? 0, next));
            }
          }}
          style={{ textAlignVertical: 'top', height, minHeight }}
          className={cn('flex-1 w-full px-2 py-2 text-foreground text-sm', inputClassName)}
          {...props}
        />
      </Field>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
