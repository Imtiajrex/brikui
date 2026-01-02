import * as React from 'react';
import { LegendList as LegendListBase } from '@legendapp/list';
import type { LegendListProps, LegendListRef, LegendListRenderItemProps } from '@legendapp/list';
import { Platform, StyleSheet } from 'react-native';

type Axis = 'x' | 'y';

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function pickStyleNumber(
  flatStyle: Record<string, unknown> | null | undefined,
  ...keys: string[]
): number | undefined {
  if (!flatStyle) return undefined;
  for (const key of keys) {
    const v = (flatStyle as any)[key];
    if (v != null) return toNumber(v);
  }
  return undefined;
}

function getContentPadding(
  contentContainerStyle: unknown,
  axis: Axis
): { start: number; end: number } {
  const flat = StyleSheet.flatten(contentContainerStyle as any) as
    | Record<string, unknown>
    | null
    | undefined;

  if (axis === 'y') {
    const start = pickStyleNumber(flat, 'paddingTop', 'paddingVertical', 'padding') ?? 0;
    const end = pickStyleNumber(flat, 'paddingBottom', 'paddingVertical', 'padding') ?? 0;
    return { start, end };
  }

  const start = pickStyleNumber(flat, 'paddingLeft', 'paddingHorizontal', 'padding') ?? 0;
  const end = pickStyleNumber(flat, 'paddingRight', 'paddingHorizontal', 'padding') ?? 0;
  return { start, end };
}

function getAxis(horizontal: boolean | undefined): Axis {
  return horizontal ? 'x' : 'y';
}

function wrapSnapChild(
  child: React.ReactNode,
  axis: Axis,
  snapToInterval: number
): React.ReactElement {
  const sizeProp = axis === 'y' ? 'height' : 'width';
  const alignProp = axis === 'y' ? 'scrollSnapAlign' : 'scrollSnapAlign';

  return (
    <div
      style={
        {
          [sizeProp]: snapToInterval,
          [alignProp]: 'start',
        } as React.CSSProperties
      }
    >
      {child}
    </div>
  );
}

type ListComponent = (<T>(
  props: LegendListProps<T> & React.RefAttributes<LegendListRef>
) => React.ReactNode) & {
  displayName?: string;
};

const List = React.forwardRef<LegendListRef, LegendListProps<any>>(function List(
  props,
  forwardedRef
) {
  const internalRef = React.useRef<LegendListRef | null>(null);
  const didCorrectInitialPaddingSnap = React.useRef(false);

  React.useImperativeHandle(forwardedRef, () => internalRef.current as LegendListRef, []);

  const isWeb = Platform.OS === 'web';
  const axis = getAxis((props as any).horizontal);
  const snapToInterval = (props as any).snapToInterval as number | undefined;
  const pagingEnabled = Boolean((props as any).pagingEnabled);
  const contentPadding = React.useMemo(
    () => getContentPadding((props as any).contentContainerStyle, axis),
    [axis, (props as any).contentContainerStyle]
  );

  const renderItem = (props as any).renderItem as
    | ((info: LegendListRenderItemProps<any, any>) => React.ReactNode)
    | React.ComponentType<LegendListRenderItemProps<any, any>>
    | undefined;

  const wrappedRenderItem = React.useMemo(() => {
    if (!isWeb || !snapToInterval || !renderItem) return renderItem;

    const render =
      typeof renderItem === 'function'
        ? (renderItem as (info: LegendListRenderItemProps<any, any>) => React.ReactNode)
        : (info: LegendListRenderItemProps<any, any>) => React.createElement(renderItem, info);

    return (info: LegendListRenderItemProps<any, any>) =>
      wrapSnapChild(render(info), axis, snapToInterval);
  }, [axis, isWeb, renderItem, snapToInterval]);

  const wrappedChildren = React.useMemo(() => {
    if (!isWeb || !snapToInterval || (props as any).children == null)
      return (props as any).children;
    const children = React.Children.toArray((props as any).children);
    return children.map((child, index) => (
      <React.Fragment key={(child as any)?.key ?? index}>
        {wrapSnapChild(child, axis, snapToInterval)}
      </React.Fragment>
    ));
  }, [axis, isWeb, props, snapToInterval]);

  React.useEffect(() => {
    if (!isWeb || !snapToInterval) return;
    const list = internalRef.current;
    if (!list) return;

    const node = list.getScrollableNode?.() as any;
    const el: any | null =
      node && typeof node === 'object' && 'style' in node ? (node as HTMLElement) : null;
    if (!el) return;

    // CSS scroll snapping + momentum-ish feel
    const scrollSnapType = `${axis} mandatory`;
    (el.style as any).scrollSnapType = scrollSnapType;
    (el.style as any).scrollBehavior = 'smooth';

    // Respect RN contentContainerStyle padding when snapping.
    // Without this, the browser snaps items flush to the scrollport edge,
    // effectively ignoring top/bottom (or left/right) padding.
    const { start, end } = contentPadding;
    if (axis === 'y') {
      (el.style as any).scrollPadding = `${start}px 0px ${end}px 0px`;
      (el.style as any).scrollPaddingTop = `${start}px`;
      (el.style as any).scrollPaddingBottom = `${end}px`;
    } else {
      (el.style as any).scrollPadding = `0px ${end}px 0px ${start}px`;
      (el.style as any).scrollPaddingLeft = `${start}px`;
      (el.style as any).scrollPaddingRight = `${end}px`;
    }

    // If the browser already snapped the first item *past* the padding
    // before we applied scrollPadding, correct it once so the padding shows.
    if (!didCorrectInitialPaddingSnap.current && start > 0) {
      didCorrectInitialPaddingSnap.current = true;
      const current = axis === 'y' ? el.scrollTop : el.scrollLeft;
      if (current > 0 && current <= start + 1) {
        if (axis === 'y') el.scrollTo({ top: 0 } as any);
        else el.scrollTo({ left: 0 } as any);
      }
    }

    // iOS Safari momentum scrolling
    (el.style as any).webkitOverflowScrolling = 'touch';

    // Note: On web, CSS scroll snapping already provides paging-like behavior.
    // A manual scroll rounding handler fights the browser snap logic and
    // can cause contentContainerStyle padding (top/bottom) to be ignored.
    // So we intentionally do nothing special for pagingEnabled here.
    return;
  }, [axis, contentPadding, isWeb, pagingEnabled, snapToInterval]);

  const getFixedItemSize = (props as any).getFixedItemSize as
    | ((index: number, item: any, type: any) => number | undefined)
    | undefined;

  const mergedGetFixedItemSize = React.useMemo(() => {
    if (!snapToInterval || getFixedItemSize) return getFixedItemSize;
    return () => snapToInterval;
  }, [getFixedItemSize, snapToInterval]);

  return (
    <LegendListBase
      ref={internalRef}
      {...(props as any)}
      getFixedItemSize={mergedGetFixedItemSize}
      renderItem={wrappedRenderItem as any}
    >
      {wrappedChildren}
    </LegendListBase>
  );
}) as unknown as ListComponent;

List.displayName = 'List';

export { List };
export type { LegendListProps as ListProps, LegendListRef as ListRef };
