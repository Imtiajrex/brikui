import * as React from 'react';
import { View } from '../base/view';
import { Pressable } from '../base/pressable';
import { Text } from '../base/text';
import { cva, cn, type VariantProps } from '../../lib/utils/utils';
import { renderNode } from '../../lib/utils/renderNode';

type Item = string | { label: React.ReactNode; value: string; disabled?: boolean };

const containerVariants = cva('border rounded-input overflow-hidden bg-muted transition-all', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    withItemBorders: {
      true: 'p-0',
      false: 'p-1',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: true,
    withItemBorders: false,
  },
});

const itemVariants = cva('items-center justify-center', {
  variants: {
    size: {
      sm: 'px-2 h-8',
      md: 'px-3 h-9',
      lg: 'px-4 h-11',
    },
    selected: {
      true: 'bg-card',
      false: '',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    selected: false,
    disabled: false,
  },
});

const labelVariants = cva('text-sm text-foreground', {
  variants: {},
});

type BaseProps = React.ComponentPropsWithoutRef<typeof View>;

type SegmentedControlProps = Omit<BaseProps, 'onLayout'> &
  VariantProps<typeof containerVariants> &
  VariantProps<typeof itemVariants> & {
    data: Item[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    radius?: number; // overrides rounded-input
    className?: string; // container
    itemClassName?: string;
    labelClassName?: string;
    itemActiveClassName?: string;
  };

const normalize = (item: Item): { label: React.ReactNode; value: string; disabled?: boolean } =>
  typeof item === 'string' ? { label: item, value: item } : item;

const SegmentedControl = React.forwardRef<View, SegmentedControlProps>((props, ref) => {
  const {
    data,
    value,
    defaultValue,
    onChange,
    className,
    itemClassName,
    labelClassName,
    fullWidth,
    withItemBorders,
    orientation = 'horizontal',
    size = 'md',
    radius,
    itemActiveClassName,
    ...rest
  } = props;

  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue ?? (data.length > 0 ? normalize(data[0]).value : undefined)
  );
  const val = value ?? internal;

  const isVertical = orientation === 'vertical';

  return (
    <View
      ref={ref}
      className={cn(containerVariants({ orientation, fullWidth, withItemBorders }), className)}
      style={radius != null ? { borderRadius: radius } : undefined}
      {...rest}
    >
      {data.map((it, i) => {
        const { label, value: v, disabled } = normalize(it);
        const selected = v === val;
        const isFirst = i === 0;
        const borderStyle = withItemBorders
          ? isVertical
            ? { borderTopWidth: isFirst ? 0 : 1 }
            : { borderLeftWidth: isFirst ? 0 : 1 }
          : null;
        return (
          <Pressable
            key={v}
            accessible
            accessibilityRole="button"
            accessibilityState={{ selected, disabled: !!disabled }}
            onPress={() => {
              if (disabled) return;
              if (value == null) setInternal(v);
              onChange?.(v);
            }}
            className={cn(
              'flex-1',
              itemVariants({ size, selected, disabled }),
              !withItemBorders && 'rounded-md',
              itemClassName,
              withItemBorders && 'border-border',
              selected && itemActiveClassName
            )}
            style={[
              borderStyle as any,
              radius != null && !withItemBorders ? { borderRadius: radius - 4 } : null,
              isVertical ? { width: '100%' } : null,
            ]}
          >
            {renderNode(label, cn(labelVariants(), labelClassName))}
          </Pressable>
        );
      })}
    </View>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
export type { SegmentedControlProps };
