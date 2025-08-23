import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import StickyRangeSlider from 'react-native-sticky-range-slider';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';
import { Field } from '../field';

const containerVariants = cva(
  'flex-row border-none items-center rounded-none gap-2 pt-4 transition-all overflow-visible',
  {
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
        sm: 'min-h-9',
        default: 'min-h-10',
        lg: 'min-h-12',
      },
    },
    defaultVariants: {
      fullWidth: true,
      invalid: false,
      disabled: false,
      size: 'default',
    },
  }
);

type RangeSliderProps = VariantProps<typeof containerVariants> & {
  // library props
  min: number;
  max: number;
  step?: number;
  minRange?: number;
  low: number;
  high: number;
  disableRange?: boolean;
  onValueChange?: (low: number, high: number) => void;
  // renderers overrides
  renderThumb?: (type: 'high' | 'low') => React.ReactNode;
  renderRail?: () => React.ReactNode;
  renderRailSelected?: () => React.ReactNode;
  renderLowValue?: (value: number) => React.ReactNode;
  renderHighValue?: (value: number) => React.ReactNode;
  // Field props
  label?: string;
  description?: string;
  error?: string;
  withAsterisk?: boolean;
  // classNames
  className?: string; // wrapper block
  containerClassName?: string; // row container
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  style?: any;
};

const DefaultThumb = (type: 'high' | 'low') => (
  <View
    className={cn(
      'w-5 h-5 rounded-full border-2',
      type === 'high' ? 'bg-primary border-primary' : 'bg-foreground border-foreground'
    )}
  />
);

const DefaultRail = () => <View className="flex-1 h-[3px] rounded bg-muted" />;
const DefaultRailSelected = () => <View className="h-[3px] rounded bg-primary" />;
const DefaultValue = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-xs text-foreground">{children}</Text>
);

const RangeSlider = React.forwardRef<React.ComponentRef<typeof View>, RangeSliderProps>(
  (props, ref) => {
    const {
      min,
      max,
      step = 1,
      minRange,
      low,
      high,
      disableRange,
      onValueChange,
      renderThumb,
      renderRail,
      renderRailSelected,
      renderLowValue,
      renderHighValue,
      // Field bits
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
      fullWidth,
      size,
      disabled,
      invalid,
    } = props;

    const handleValueChanged = React.useCallback(
      (l: number, h: number) => {
        onValueChange?.(l, h);
      },
      [onValueChange]
    );

    return (
      <Field
        className={className}
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
          containerVariants({ fullWidth, size, disabled, invalid: !!error }),
          containerClassName
        )}
      >
        <View ref={ref} className={cn('flex-1 w-full')} style={style}>
          <StickyRangeSlider
            min={min}
            max={max}
            step={step}
            minRange={minRange}
            low={low}
            high={high}
            onValueChanged={handleValueChanged}
            renderLowValue={renderLowValue ?? ((v: number) => <DefaultValue>{v}</DefaultValue>)}
            renderHighValue={
              renderHighValue ??
              ((v: number) => <DefaultValue>{v === max ? `+${v}` : v}</DefaultValue>)
            }
            renderThumb={renderThumb ?? DefaultThumb}
            renderRail={renderRail ?? DefaultRail}
            renderRailSelected={renderRailSelected ?? DefaultRailSelected}
            disableRange={disableRange}
          />
        </View>
      </Field>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

export { RangeSlider };
export type { RangeSliderProps };
