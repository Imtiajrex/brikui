import * as React from 'react';
import { View } from 'react-native';
import { Slider as AwesomeSlider, SliderThemeType } from 'react-native-awesome-slider';
import type { SharedValue } from 'react-native-reanimated';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';
import { Field } from '../field';

// Container variants similar to Input
const sliderVariants = cva('flex-row items-center gap-2 rounded-input  transition-all', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    invalid: {
      true: 'border-destructive',
      false: 'border-input',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    fullWidth: true,
    invalid: false,
    disabled: false,
    size: 'default',
  },
});

type SliderProps = VariantProps<typeof sliderVariants> & {
  progress: SharedValue<number>;
  minimumValue: SharedValue<number>;
  maximumValue: SharedValue<number>;
  // Field props
  label?: string;
  description?: string;
  error?: string;
  withAsterisk?: boolean;
  // classNames
  className?: string; // wrapper for Field block
  containerClassName?: string; // container row (applies variants)
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  // styles
  style?: any;
  theme?: SliderThemeType;
};

const Slider = React.forwardRef<View, SliderProps>(
  (
    {
      progress,
      minimumValue,
      maximumValue,
      label,
      description,
      error,
      withAsterisk,
      className,
      containerClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      style,
      theme,
      disabled,
      fullWidth,
      size,
      invalid,
      ...rest
    },
    ref
  ) => {
    return (
      <Field
        className={cn('h-auto p-0 border-none', className)}
        label={label}
        description={description}
        error={error}
        withAsterisk={withAsterisk}
        disabled={!!disabled}
        invalid={!!error || !!invalid}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
        errorClassName={errorClassName}
        containerClassName={cn(
          'p-0 px-0 py-0 h-auto border-none',
          sliderVariants({ fullWidth, size, disabled, invalid: !!error }),
          containerClassName
        )}
      >
        <View
          ref={ref}
          className={cn('flex-1 w-full')}
          style={style}
          pointerEvents={disabled ? 'none' : 'auto'}
        >
          <AwesomeSlider
            progress={progress}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            theme={theme}
            {...(rest as any)}
          />
        </View>
      </Field>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
export type { SliderProps };
