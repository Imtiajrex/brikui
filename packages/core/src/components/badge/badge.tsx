import * as React from 'react';
import { View, Text as RNText } from 'react-native';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';

// Badge variants similar to Mantine: filled, light, outline, dot, transparent, default.
const badgeVariants = cva(
  'flex-row items-center gap-1 rounded-full px-2.5 h-6 border border-transparent',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground',
        default: 'bg-muted text-foreground',
        light: 'bg-primary/10 text-primary',
        outline: 'bg-background border-border text-foreground',
        transparent: 'bg-transparent text-foreground',
        dot: 'bg-muted text-foreground pl-2 pr-2.5',
      },
      size: {
        xs: 'h-5 px-2',
        sm: 'h-6 px-2.5',
        md: 'h-7 px-3',
        lg: 'h-8 px-3.5',
      },
      radius: {
        full: 'rounded-full',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
      },
      withBorder: { true: 'border-border', false: '' },
      uppercase: { true: '', false: '' },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      radius: 'full',
      withBorder: false,
      uppercase: true,
    },
  }
);

const badgeTextVariants = cva('font-medium leading-none', {
  variants: {
    size: {
      xs: 'text-[10px]',
      sm: 'text-[11px]',
      md: 'text-xs',
      lg: 'text-sm',
    },
    uppercase: { true: 'uppercase tracking-wide', false: '' },
  },
  defaultVariants: { size: 'sm', uppercase: true },
});

type BadgeProps = React.ComponentPropsWithoutRef<typeof View> &
  VariantProps<typeof badgeVariants> &
  VariantProps<typeof badgeTextVariants> & {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
  };

const Dot = ({ className }: { className?: string }) => (
  <View className={cn('size-1.5 rounded-full bg-primary', className)} />
);

const Badge = React.forwardRef<View, BadgeProps>((props, ref) => {
  const {
    className,
    children,
    variant = 'default',
    size,
    radius,
    leftSection,
    rightSection,
    uppercase,
    withBorder,
    ...rest
  } = props;

  return (
    <View
      ref={ref}
      accessibilityRole="text"
      className={cn(badgeVariants({ variant, size, radius, withBorder, uppercase }), className)}
      {...rest}
    >
      {variant === 'dot' ? <Dot /> : leftSection}
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText className={cn(badgeTextVariants({ size, uppercase }))}>{children}</RNText>
      ) : (
        children
      )}
      {rightSection}
    </View>
  );
});

Badge.displayName = 'Badge';

export { Badge, badgeVariants, badgeTextVariants };
export type { BadgeProps };
