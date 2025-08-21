import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { Pressable } from '../base/pressable';
import { cn, cva, type VariantProps } from '../../lib/utils/utils';
import { X } from '../../lib/icons/X';

type BaseProps = React.ComponentPropsWithoutRef<typeof View>;

const containerVariants = cva('flex-row gap-3 p-4 border rounded-md items-start', {
  variants: {
    variant: {
      light: '',
      filled: 'text-primary-foreground',
    },
    color: {
      primary: '',
      secondary: '',
      accent: '',
      success: '',
      destructive: '',
    },
  },
  defaultVariants: {
    variant: 'light',
    color: 'primary',
  },
});

// Mapping variant+color to utility classes
function resolveColorClasses(
  variant: VariantProps<typeof containerVariants>['variant'],
  color: VariantProps<typeof containerVariants>['color']
) {
  const base = {
    primary: {
      light: 'bg-primary/10 border-primary/20 text-foreground',
      filled: 'bg-primary',
    },
    secondary: {
      light: 'bg-secondary/10 border-secondary/20 text-foreground',
      filled: 'bg-secondary',
    },
    accent: {
      light: 'bg-accent/20 border-accent/30 text-foreground',
      filled: 'bg-accent',
    },
    success: {
      light: 'bg-success/15 border-success/30 text-success',
      filled: 'bg-success',
    },
    destructive: {
      light: 'bg-destructive/10 border-destructive/30 text-destructive',
      filled: 'bg-destructive',
    },
  } as const;
  const c = color && base[color] ? base[color] : base.primary;
  return c[variant || 'light'];
}

const titleVariants = cva('font-semibold text-sm', {
  variants: { variant: { light: '', filled: '' } },
  defaultVariants: { variant: 'light' },
});

export interface AlertProps
  extends Omit<BaseProps, 'children'>,
    VariantProps<typeof containerVariants> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  withCloseButton?: boolean;
  onClose?: () => void;
  radius?: number; // numeric override
}

export const Alert = React.forwardRef<View, AlertProps>((props, ref) => {
  const {
    title,
    icon,
    children,
    withCloseButton,
    onClose,
    className,
    variant = 'light',
    color = 'primary',
    radius,
    ...rest
  } = props;

  return (
    <View
      ref={ref}
      accessibilityRole="summary"
      className={cn(
        containerVariants({ variant, color }),
        resolveColorClasses(variant, color),
        withCloseButton && 'pr-3',
        className
      )}
      style={radius != null ? { borderRadius: radius } : undefined}
      {...rest}
    >
      {icon ? <View className="mt-0.5">{icon}</View> : null}
      <View className="flex-1 gap-1">
        {title ? (
          typeof title === 'string' || typeof title === 'number' ? (
            <Text className={titleVariants({ variant })}>{title}</Text>
          ) : (
            title
          )
        ) : null}
        {children ? (
          typeof children === 'string' || typeof children === 'number' ? (
            <Text className="text-xs leading-snug text-foreground/80">{children}</Text>
          ) : (
            children
          )
        ) : null}
      </View>
      {withCloseButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close alert"
          onPress={onClose}
          className={cn(
            'h-6 w-6 items-center justify-center rounded-sm ml-2',
            variant === 'filled' ? 'bg-black/20 active:bg-black/30' : 'active:bg-black/10'
          )}
        >
          <X
            className={cn(
              'h-4 w-4',
              variant === 'filled' ? 'text-primary-foreground' : 'text-foreground/70'
            )}
          />
        </Pressable>
      ) : null}
    </View>
  );
});

Alert.displayName = 'Alert';
