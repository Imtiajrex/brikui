import * as React from 'react';
import { Pressable, View, Text, Platform } from 'react-native';
import Animated, {
  Layout,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';

const trackVariants = cva(
  'relative rounded-full border transition-colors justify-center overflow-hidden',
  {
    variants: {
      size: {
        xs: 'h-5',
        sm: 'h-6',
        md: 'h-7',
        lg: 'h-8',
        xl: 'h-9',
      },
      checked: {
        true: 'bg-primary border-primary',
        false: 'bg-muted border-input',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      disabled: false,
    },
  }
);

const thumbVariants = cva('rounded-full bg-background shadow', {
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  defaultVariants: { size: 'md' },
});

type SwitchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const dims: Record<
  SwitchSize,
  { w: number; h: number; pad: number; thumb: number; label: string }
> = {
  xs: { w: 40, h: 20, pad: 2, thumb: 16, label: 'text-[8px]' },
  sm: { w: 48, h: 24, pad: 2, thumb: 20, label: 'text-[8px]' },
  md: { w: 56, h: 28, pad: 3, thumb: 22, label: 'text-[10px]' },
  lg: { w: 64, h: 32, pad: 3, thumb: 26, label: 'text-[12px]' },
  xl: { w: 72, h: 36, pad: 4, thumb: 28, label: 'text-[12px]' },
};

type BaseProps = React.ComponentPropsWithoutRef<typeof Pressable>;

type SwitchProps = Omit<BaseProps, 'onPress'> &
  VariantProps<typeof trackVariants> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onLabel?: React.ReactNode;
    offLabel?: React.ReactNode;
    label?: React.ReactNode; // external label beside the switch
    className?: string; // wrapper
    trackClassName?: string;
    thumbClassName?: string;
    labelClassName?: string; // for both labels
  };

const Switch = React.forwardRef<React.ElementRef<typeof Pressable>, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      size,
      onLabel,
      offLabel,
      label: sideLabel,
      className,
      trackClassName,
      thumbClassName,
      labelClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false);
    const isOn = checked ?? internal;

    const { w, h, pad, thumb, label: labelSizeClass } = dims[(size ?? 'md') as SwitchSize];
    // Distance the thumb travels between OFF and ON
    const travelX = w - thumb - 2 * pad;

    // Reanimated: progress 0 -> 1 for OFF -> ON
    const progress = useSharedValue(isOn ? 1 : 0);

    React.useEffect(() => {
      progress.value = withTiming(isOn ? 1 : 0, { duration: 1 });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOn]);

    const onLabelAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0, 0.9]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [-4, 0]),
        },
      ],
    }));

    const offLabelAnimatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 1], [0.9, 0]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [0, 4]),
        },
      ],
    }));

    return (
      <Pressable
        ref={ref}
        accessibilityRole="switch"
        accessibilityState={{ disabled: !!disabled, checked: isOn }}
        onPress={() => {
          if (disabled) return;
          const next = !isOn;
          setInternal(next);
          onCheckedChange?.(next);
        }}
        className={cn('flex-row items-center gap-2', className)}
        {...props}
      >
        <View
          className={cn(trackVariants({ size, checked: isOn, disabled }), trackClassName)}
          style={{ width: w, height: h, padding: pad, borderRadius: h / 2 }}
        >
          {offLabel ? (
            <Animated.Text
              className={cn(
                'text-[10px] absolute right-1.5 text-primary',
                labelSizeClass,
                labelClassName
              )}
              style={offLabelAnimatedStyle}
            >
              {offLabel}
            </Animated.Text>
          ) : null}
          {onLabel ? (
            <Animated.Text
              className={cn(
                'text-[10px] absolute left-1.5 text-background',
                labelSizeClass,
                labelClassName
              )}
              style={onLabelAnimatedStyle}
            >
              {onLabel}
            </Animated.Text>
          ) : null}

          <Animated.View
            className={cn('bg-background', thumbVariants({ size }), thumbClassName)}
            style={{
              width: thumb,
              height: thumb,
              borderRadius: thumb / 2,
              // Use layout animation via marginLeft change
              marginLeft: isOn ? travelX : 0,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
            }}
            layout={
              Platform.OS === 'web'
                ? LinearTransition.springify(100).damping(50)
                : LinearTransition.springify(500).damping(980)
            }
          />
        </View>
        {sideLabel != null ? (
          typeof sideLabel === 'string' || typeof sideLabel === 'number' ? (
            <Text>{sideLabel}</Text>
          ) : (
            sideLabel
          )
        ) : null}
      </Pressable>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
