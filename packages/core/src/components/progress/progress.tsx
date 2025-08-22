import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Field } from '../field';

// Track variants
const trackVariants = cva('overflow-hidden rounded-full bg-muted relative', {
  variants: {
    size: {
      xs: 'h-1.5',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-40',
    },
  },
  defaultVariants: {
    size: 'md',
    fullWidth: true,
  },
});

// Indicator variants
const indicatorVariants = cva('h-full bg-primary', {
  variants: {
    color: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent',
      success: 'bg-success',
      destructive: 'bg-destructive',
    },
    animated: {
      true: 'transition-all',
      false: '',
    },
    striped: {
      true: 'bg-[repeating-linear-gradient(45deg,theme(colors.primary.DEFAULT),theme(colors.primary.DEFAULT)_10px,theme(colors.primary.foreground)/40_10px,theme(colors.primary.foreground)/40_20px)]',
      false: '',
    },
  },
  defaultVariants: {
    color: 'primary',
    animated: true,
    striped: false,
  },
});

export type ProgressProps = VariantProps<typeof trackVariants> &
  VariantProps<typeof indicatorVariants> & {
    value?: number; // 0-100
    max?: number; // default 100
    indeterminate?: boolean;
    // Field props
    label?: string;
    description?: string;
    withAsterisk?: boolean;
    error?: string; // not typical but for consistency
    // classNames
    className?: string; // Field wrapper
    trackClassName?: string;
    indicatorClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
    showValueLabel?: boolean; // show numeric value at end
    valueFormatter?: (value: number, max: number) => string;
  };

const Progress = React.forwardRef<React.ComponentRef<typeof View>, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate,
      label,
      description,
      withAsterisk,
      error,
      className,
      trackClassName,
      indicatorClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      showValueLabel = false,
      valueFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
      size,
      fullWidth,
      color,
      animated,
      striped,
    },
    ref
  ) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const progress = clamped / max;
    const anim = useSharedValue(progress);

    React.useEffect(() => {
      anim.value = withTiming(progress, { duration: 300 });
    }, [progress, anim]);

    const indicatorStyle = useAnimatedStyle(() => ({
      width: `${indeterminate ? 40 : anim.value * 100}%`,
    }));
    const indeterminateAnim = useSharedValue(0);
    React.useEffect(() => {
      if (indeterminate) {
        indeterminateAnim.value = 0;
        const loop = () => {
          indeterminateAnim.value = withTiming(100, { duration: 1200 }, () => {
            indeterminateAnim.value = 0;
            loop();
          });
        };
        loop();
      }
    }, [indeterminate, indeterminateAnim]);
    const indeterminateStyle = useAnimatedStyle(() => ({
      transform: indeterminate ? [{ translateX: `${indeterminateAnim.value}%` }] : undefined,
    }));

    return (
      <Field
        label={label}
        description={description}
        withAsterisk={withAsterisk}
        error={error}
        className={className}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
        errorClassName={errorClassName}
        containerClassName={cn(
          'flex-row items-center gap-2 border-none p-0 h-auto',
          showValueLabel && 'pr-2'
        )}
      >
        <View className={cn('flex-row items-center gap-2 w-full')}>
          <View
            ref={ref}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max, now: indeterminate ? undefined : clamped }}
            className={cn(trackVariants({ size, fullWidth }), trackClassName)}
          >
            <Animated.View
              className={cn(
                indicatorVariants({ color, animated, striped }),
                indeterminate && 'absolute left-0 w-2/5',
                indicatorClassName
              )}
              style={indeterminate ? indeterminateStyle : indicatorStyle}
            />
          </View>
          {showValueLabel && !indeterminate ? (
            <Text className="text-xs text-muted-foreground min-w-[32px] text-right">
              {valueFormatter(clamped, max)}
            </Text>
          ) : null}
        </View>
      </Field>
    );
  }
);

Progress.displayName = 'Progress';

export {
  Progress,
  trackVariants as progressTrackVariants,
  indicatorVariants as progressIndicatorVariants,
};
