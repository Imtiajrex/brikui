import * as React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Platform, View } from 'react-native';

import { List, type ListRef } from '../list/list';
import { WheelPickerItem, type WheelPickerItemData } from './wheel-picker-item';
import { clampIndex } from './use-wheel-picker-value';
import { cn } from '../../lib/utils/utils';

function getIndexFromOffset(offset: number, itemHeight: number, length: number) {
  if (!Number.isFinite(offset) || !Number.isFinite(itemHeight) || itemHeight <= 0) return 0;
  return clampIndex(Math.round(offset / itemHeight), length);
}

function scrollToItem(
  listRef: React.RefObject<ListRef | null>,
  actualIndex: number,
  itemHeight: number,
  animated: boolean,
  spacerCount: number,
  padding: number
) {
  const list = listRef.current;
  if (!list) return;

  // Prefer scrollToIndex so the list can virtualize around the target index.
  // (This avoids a blank window on native when jumping to large offsets.)
  if (typeof (list as any).scrollToIndex === 'function') {
    (list as any).scrollToIndex({
      index: actualIndex + spacerCount,
      animated,
      viewPosition: 0,
      // Align the item with the centered selection window.
      viewOffset: padding,
    });
    return;
  }

  // Fallback: scrollToOffset.
  if (typeof (list as any).scrollToOffset === 'function') {
    (list as any).scrollToOffset({
      offset: actualIndex * itemHeight,
      animated,
    });
    return;
  }
}

type WheelPickerListProps<TValue> = {
  items: Array<WheelPickerItemData<TValue>>;
  selectedIndex: number;
  onIndexChange: (index: number, userInitiated: boolean) => void;
  itemHeight: number;
  visibleItems: number;
  hapticFeedback: boolean;
  className?: string;
  overlayBgColorClassName?: string;
};

const WheelPickerList = React.forwardRef<
  { scrollToIndex: (index: number, animated: boolean) => void },
  WheelPickerListProps<any>
>(
  (
    {
      items,
      selectedIndex,
      onIndexChange,
      itemHeight,
      visibleItems,
      hapticFeedback,
      className,
      overlayBgColorClassName,
    },
    ref
  ) => {
    const listRef = React.useRef<ListRef | null>(null);
    const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastScrollOffsetRef = React.useRef(0);
    const ignoreScrollEventsRef = React.useRef(false);
    const momentumActiveRef = React.useRef(false);
    const userInteractingRef = React.useRef(false);
    const scrollHapticIndexRef = React.useRef<number | null>(null);
    const lastHapticAtRef = React.useRef(0);
    const hapticsModuleRef = React.useRef<any>(null);
    const isWeb = Platform.OS === 'web';

    const safeVisible = Math.max(1, Math.floor(visibleItems));
    const viewportHeight = safeVisible * itemHeight;
    const padding = Math.max(0, (viewportHeight - itemHeight) / 2);
    const spacerCount = Math.floor(safeVisible / 2);

    type PaddedItem<TValue> =
      | { __type: 'spacer'; key: string }
      | { __type: 'item'; data: WheelPickerItemData<TValue> };

    const paddedItems = React.useMemo<Array<PaddedItem<any>>>(() => {
      const top: Array<PaddedItem<any>> = Array.from({ length: spacerCount }, (_, i) => ({
        __type: 'spacer',
        key: `__wheel_spacer_start_${i}`,
      }));
      const bottom: Array<PaddedItem<any>> = Array.from({ length: spacerCount }, (_, i) => ({
        __type: 'spacer',
        key: `__wheel_spacer_end_${i}`,
      }));
      const body = items.map((it) => ({ __type: 'item' as const, data: it }));
      return [...top, ...body, ...bottom];
    }, [items, spacerCount]);

    React.useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number, animated: boolean) => {
        ignoreScrollEventsRef.current = true;
        scrollToItem(listRef, index, itemHeight, animated, spacerCount, padding);
        setTimeout(
          () => {
            ignoreScrollEventsRef.current = false;
          },
          animated ? 200 : 0
        );
      },
    }));

    const triggerHaptic = React.useCallback(async () => {
      if (!isWeb && hapticFeedback) {
        const now = Date.now();
        if (now - lastHapticAtRef.current >= 30) {
          lastHapticAtRef.current = now;
          try {
            if (!hapticsModuleRef.current) {
              hapticsModuleRef.current = await import('expo-haptics');
            }
            await hapticsModuleRef.current.selectionAsync();
          } catch {
            // Optional dependency; ignore if not installed.
          }
        }
      }
    }, [hapticFeedback, isWeb]);

    const commitIndex = React.useCallback(
      (nextIndex: number, userInitiated: boolean) => {
        if (userInitiated) {
          triggerHaptic();
        }
        onIndexChange(nextIndex, userInitiated);
      },
      [triggerHaptic]
    );

    const onScrollEnd = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = e.nativeEvent.contentOffset?.y ?? 0;
        const nextIndex = getIndexFromOffset(offsetY, itemHeight, items.length);
        if (ignoreScrollEventsRef.current) return;
        if (!userInteractingRef.current) return;
        // Only commit when the user actually interacted.
        // This prevents initial layout/programmatic scroll syncing from emitting
        // a value change (e.g. when opening an overlay).
        commitIndex(nextIndex, true);
      },
      [commitIndex, itemHeight, items.length]
    );

    const onScroll = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastScrollOffsetRef.current = e.nativeEvent.contentOffset?.y ?? 0;

        if (ignoreScrollEventsRef.current) return;
        // LegendList on web doesn't reliably fire begin-drag events, so we treat
        // the first post-mount scroll as user interaction.
        if (isWeb && !userInteractingRef.current) {
          userInteractingRef.current = true;
        }

        const nextIndex = getIndexFromOffset(lastScrollOffsetRef.current, itemHeight, items.length);

        // While scrolling, provide haptic ticks on index changes (doesn't commit value).
        if (
          userInteractingRef.current &&
          hapticFeedback &&
          !isWeb &&
          scrollHapticIndexRef.current !== nextIndex
        ) {
          scrollHapticIndexRef.current = nextIndex;
          triggerHaptic();
        }

        // Web: LegendList + CSS snap doesn't reliably fire momentum/end events.
        // Debounce scroll and commit once it settles.
        if (isWeb) {
          // Avoid committing due to initial layout / programmatic scroll.
          if (!userInteractingRef.current) return;
          if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
          settleTimerRef.current = setTimeout(() => {
            const idx = getIndexFromOffset(lastScrollOffsetRef.current, itemHeight, items.length);
            commitIndex(idx, true);
            userInteractingRef.current = false;
          }, 120);
        }
      },
      [commitIndex, hapticFeedback, isWeb, itemHeight, items.length]
    );

    React.useEffect(() => {
      // Keep the scroll position aligned with the controlled selectedIndex.
      // Run after mount/prop changes even if scroll events are initially ignored.
      const t = setTimeout(() => {
        if (userInteractingRef.current || momentumActiveRef.current) return;
        ignoreScrollEventsRef.current = true;
        scrollToItem(listRef, selectedIndex, itemHeight, false, spacerCount, padding);
        setTimeout(() => {
          ignoreScrollEventsRef.current = false;
        }, 0);
      }, 0);
      return () => clearTimeout(t);
    }, [itemHeight, padding, selectedIndex, spacerCount]);

    const onPressItem = React.useCallback(
      (actualIndex: number) => {
        userInteractingRef.current = true;
        scrollToItem(listRef, actualIndex, itemHeight, false, spacerCount, padding);
        commitIndex(actualIndex, true);
        setTimeout(() => {
          userInteractingRef.current = false;
        }, 0);
      },
      [commitIndex, itemHeight, padding, spacerCount]
    );

    const renderItem = React.useCallback(
      ({ item, index }: { item: PaddedItem<any>; index: number }) => {
        if (item.__type === 'spacer') {
          return <View pointerEvents="none" style={{ height: itemHeight }} />;
        }
        const actualIndex = index - spacerCount;
        return (
          <WheelPickerItem
            item={item.data}
            index={actualIndex}
            itemHeight={itemHeight}
            onPress={onPressItem}
          />
        );
      },
      [itemHeight, onPressItem, spacerCount]
    );

    return (
      <View
        className={cn('relative overflow-hidden flex', className)}
        style={{ height: viewportHeight }}
      >
        <View
          pointerEvents="none"
          className="bg-foreground/5 absolute left-0 right-0 rounded-md z-50"
          style={{ top: padding, height: itemHeight }}
        />
        <View
          pointerEvents="none"
          className={cn(
            'bg-background/50 absolute left-0 top-0 w-full z-50',
            overlayBgColorClassName
          )}
          style={{ height: itemHeight * (safeVisible / 2.5) }}
        />
        <View
          pointerEvents="none"
          className={cn(
            'bg-background/50 absolute left-0 bottom-0 w-full z-50',
            overlayBgColorClassName
          )}
          style={{ height: itemHeight * (safeVisible / 2.5) }}
        />
        <List
          ref={listRef}
          data={paddedItems}
          renderItem={renderItem}
          keyExtractor={(item) => (item.__type === 'spacer' ? item.key : String(item.data.value))}
          initialScrollIndex={{
            index: selectedIndex,
          }}
          estimatedListSize={{ height: viewportHeight, width: 1 }}
          recycleItems
          snapToInterval={itemHeight}
          decelerationRate={0.7}
          showsVerticalScrollIndicator={Platform.OS === 'web' ? true : false}
          contentContainerStyle={undefined}
          extraData={{
            selectedIndex,
          }}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onScrollBeginDrag={() => {
            userInteractingRef.current = true;
            scrollHapticIndexRef.current = null;
          }}
          onMomentumScrollBegin={() => {
            momentumActiveRef.current = true;
          }}
          onMomentumScrollEnd={(e) => {
            momentumActiveRef.current = false;
            onScrollEnd(e);
            userInteractingRef.current = false;
          }}
          onScrollEndDrag={(e) => {
            if (Platform.OS !== 'web') return;
            if (!momentumActiveRef.current) {
              onScrollEnd(e);
              userInteractingRef.current = false;
            }
          }}
          estimatedItemSize={itemHeight}
        />
      </View>
    );
  }
);

WheelPickerList.displayName = 'WheelPickerList';

export { WheelPickerList };
export type { WheelPickerListProps, WheelPickerItemData };
