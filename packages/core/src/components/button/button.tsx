import * as React from 'react';
import { ActivityIndicator, Pressable as RNPressable, Text as RNText, View } from 'react-native';
import { cva, type VariantProps, cn } from '../../lib/utils/utils';
import { useExtractTextClasses } from '../../lib/hooks/useExtractTextClasses';
import { useColor } from '../../lib/hooks/useColor';

// Button container variants (theme-token based)
const buttonVariants = cva(
  'group flex flex-row items-center justify-center rounded-radius ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none transition-all',
  {
    variants: {
      variant: {
        // Solid styles
        default: 'bg-primary',
        secondary: 'bg-secondary',
        accent: 'bg-accent',
        success: 'bg-success',
        destructive: 'bg-destructive',
        // Non-solid styles
        outline: 'border border-input bg-background active:bg-accent',
        ghost: 'bg-transparent active:bg-accent',
        link: 'bg-transparent',
        muted: 'bg-muted',
      },
      size: {
        xs: 'h-8 px-3',
        sm: 'h-9 px-3',
        default: 'h-10 px-4',
        lg: 'h-11 px-5',
        xl: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

// Text variants aligned with container variant for proper foreground contrast
const buttonTextVariants = cva('whitespace-nowrap text-sm font-medium transition-colors', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      accent: 'text-accent-foreground',
      success: 'text-success-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground group-active:text-accent-foreground',
      ghost: 'text-foreground group-active:text-accent-foreground',
      link: 'text-primary underline-offset-4 group-active:underline',
      muted: 'text-muted-foreground',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-sm',
      lg: 'text-base',
      xl: 'text-base',
      icon: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof RNPressable> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
    isLoading?: boolean;
    left?: React.ReactNode;
    right?: React.ReactNode;
  };

const Button = React.forwardRef<React.ElementRef<typeof RNPressable>, ButtonProps>(
  (
    { className, variant, size, isLoading, left, right, children, fullWidth, disabled, ...props },
    ref
  ) => {
    const extractedTextClasses = useExtractTextClasses(className);
    const textClasses = cn(buttonTextVariants({ variant, size }), extractedTextClasses);

    // Spinner color should match current text color
    const spinnerColor = useColor(textClasses);

    return (
      <RNPressable
        ref={ref}
        accessibilityRole="button"
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isLoading || disabled}
        {...props}
      >
        <View
          className={cn('flex-row items-center justify-center', size === 'icon' ? '' : 'gap-2')}
        >
          {isLoading ? (
            <ActivityIndicator size="small" animating color={spinnerColor} />
          ) : (
            <>
              {left}
              {typeof children === 'string' || typeof children === 'number' ? (
                <RNText className={textClasses}>{children}</RNText>
              ) : (
                children
              )}
              {right}
            </>
          )}
        </View>
      </RNPressable>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonTextVariants };
export type { ButtonProps };
