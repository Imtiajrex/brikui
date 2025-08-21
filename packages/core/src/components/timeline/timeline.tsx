import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { Pressable, PressableProps } from '../base/pressable';
import { cn } from '../../lib/utils/utils';

interface TimelineContextValue {
  active: number;
  count: number;
  lineWidth: number;
  bulletSize: number;
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null);

export interface TimelineProps extends React.ComponentPropsWithoutRef<typeof View> {
  active?: number; // last active index (0-based)
  lineWidth?: number; // vertical connector thickness (px)
  bulletSize?: number; // bullet diameter (px)
  children: React.ReactNode;
  gap?: number; // vertical gap between items (px)
}

export const Timeline = React.forwardRef<View, TimelineProps>((props, ref) => {
  const {
    active = -1,
    lineWidth = 2,
    bulletSize = 24,
    children,
    className,
    gap = 20,
    ...rest
  } = props;
  const items = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];
  const count = items.length;
  return (
    <View ref={ref} className={cn('flex-col', className)} {...rest}>
      <TimelineContext.Provider value={{ active, count, lineWidth, bulletSize }}>
        {items.map((child, i) =>
          React.cloneElement(child as any, {
            _index: i,
            _gap: gap,
            key: child.key ?? i,
          })
        )}
      </TimelineContext.Provider>
    </View>
  );
});
Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends Omit<PressableProps, 'children'> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  bullet?: React.ReactNode;
  lineVariant?: 'solid' | 'dashed';
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  _index?: number; // injected
  _gap?: number; // injected
}

export const TimelineItem = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  TimelineItemProps
>((props, ref) => {
  const {
    title,
    children,
    bullet,
    lineVariant = 'solid',
    disabled,
    className,
    contentClassName,
    _index = 0,
    _gap = 20,
    ...rest
  } = props;
  const ctx = React.useContext(TimelineContext);
  if (!ctx) throw new Error('TimelineItem must be used within Timeline');
  const { active, count, lineWidth, bulletSize } = ctx;
  const isFirst = _index === 0;
  const isLast = _index === count - 1;
  const topActive = _index - 1 < active; // segment above considered active if previous index <= active -1
  const bottomActive = _index < active; // segment below considered active if current index < active
  const currentActive = _index <= active;
  // Align bullet center with title first line: approximate title line-height (16) then offset content
  const approximateTitleLineHeight = 16;
  const contentOffset = Math.max(0, bulletSize / 2 - approximateTitleLineHeight / 2);

  const lineVariantClasses = (activeSeg: boolean) =>
    lineVariant === 'dashed'
      ? cn('border-border border-dashed border rounded-full', activeSeg && 'border-primary')
      : cn('rounded-full', activeSeg ? 'bg-primary' : 'bg-border');

  const defaultBullet = (
    <View
      className={cn(
        'items-center justify-center rounded-full border',
        currentActive ? 'bg-primary border-primary' : 'bg-background border-border'
      )}
      style={{ width: bulletSize, height: bulletSize }}
    />
  );

  return (
    <View className={cn('flex-row', className)} style={{ gap: 12 }}>
      <View style={{ width: bulletSize, alignItems: 'center' }}>
        {!isFirst && (
          <View
            style={{ width: lineWidth }}
            className={cn('flex-1', lineVariantClasses(topActive))}
          />
        )}
        <Pressable
          ref={ref}
          disabled={disabled}
          accessibilityRole="button"
          className={cn(currentActive && 'active:opacity-80')}
          {...rest}
        >
          {bullet ?? defaultBullet}
        </Pressable>
        {!isLast && (
          <View
            style={{ width: lineWidth, flexGrow: 1 }}
            className={cn(lineVariantClasses(bottomActive))}
          />
        )}
      </View>
      <View
        className={cn(
          'flex-1 pb-0',
          !isLast && `pb-${Math.max(0, Math.round(_gap / 4) * 4)}`,
          contentClassName
        )}
        style={{ paddingTop: contentOffset }}
      >
        {title &&
          (typeof title === 'string' ? <Text className="font-semibold mb-1">{title}</Text> : title)}
        {typeof children === 'string' ? (
          <Text className="text-xs text-foreground/70 leading-snug">{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
});
TimelineItem.displayName = 'TimelineItem';

export const TimelineSeparator = () => null;
