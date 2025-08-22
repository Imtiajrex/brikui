import * as React from 'react';
import { Pressable } from '../base/pressable';
import { View } from '../base/view';
import { Text } from '../base/text';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';
import { Check } from '../../lib/icons/Check';

// Wrapper (full clickable area) variants
const wrapperVariants = cva('flex-row gap-3 rounded-md items-start active:opacity-80', {
  variants: {
    checked: {
      true: 'bg-accent/20',
      false: 'bg-transparent',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

// The square box indicator variants
const boxVariants = cva('items-center justify-center rounded-lg border transition-colors', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
    checked: {
      true: 'bg-primary border-primary',
      false: 'bg-background border-input',
    },
    disabled: {
      true: 'opacity-60',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    checked: false,
    disabled: false,
  },
});

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof boxVariants> & {
    checked?: boolean; // controlled
    defaultChecked?: boolean; // uncontrolled initial
    onCheckedChange?: (checked: boolean) => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    wrapperClassName?: string; // full container
    boxClassName?: string; // square box
    indicatorClassName?: string; // for the icon
    wrapperActiveClassName?: string;
  };

const Checkbox = React.forwardRef<React.ComponentRef<typeof Pressable>, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      title,
      description,
      disabled,
      size,
      wrapperClassName,
      boxClassName,
      indicatorClassName,
      wrapperActiveClassName,
      className, // deprecated, kept for backward compat (applies to wrapper)
      ...rest
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(!!defaultChecked);
    const value = checked ?? internal;

    const toggle = () => {
      if (disabled) return;
      const next = !value;
      setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <Pressable
        ref={ref}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: value, disabled: !!disabled }}
        onPress={toggle}
        className={cn(
          wrapperVariants({ checked: value, disabled }),
          className,
          wrapperClassName,
          value ? wrapperActiveClassName : ''
        )}
        disabled={disabled}
        {...rest}
      >
        <View className={cn(boxVariants({ size, checked: value, disabled }), boxClassName)}>
          {value ? (
            <Check
              className={cn(
                'h-3.5 w-3.5 text-primary-foreground',
                size === 'lg' && 'h-4 w-4',
                indicatorClassName
              )}
              size={16}
            />
          ) : null}
        </View>
        {(title != null || description != null) && (
          <View className="flex-1 pr-1 gap-1">
            {title != null &&
              (typeof title === 'string' || typeof title === 'number' ? (
                <Text className="text-sm font-medium leading-none" numberOfLines={1}>
                  {title}
                </Text>
              ) : (
                title
              ))}
            {description != null &&
              (typeof description === 'string' || typeof description === 'number' ? (
                <Text className="text-xs text-muted-foreground leading-snug">{description}</Text>
              ) : (
                description
              ))}
          </View>
        )}
      </Pressable>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, wrapperVariants as checkboxWrapperVariants, boxVariants as checkboxBoxVariants };
