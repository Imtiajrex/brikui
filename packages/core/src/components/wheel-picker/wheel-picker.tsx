import * as React from 'react';
import WheelPickerBase from '@quidone/react-native-wheel-picker';
import { Platform } from 'react-native';
import { View } from '../base/view';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';
import { Pressable } from '../base/pressable';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useColor } from '../../lib/hooks/useColor';

// Public API kept index-based for simplicity; internally maps to library's value API
export interface WheelPickerProps {
  options: (string | number)[];
  value?: number; // index (controlled)
  defaultValue?: number; // index (uncontrolled)
  onChange?: (index: number, value: string | number) => void;
  itemClassName?: string;
  activeItemClassName?: string;
  containerClassName?: string;
  height?: number; // overall height constraint (optional)
  itemHeight?: number; // each row height
  enableScrollByTapOnItem?: boolean;
  visibleItemCount?: number; // override derived visible items (must be odd)
  renderItem?: (value: string | number, active: boolean, index: number) => React.ReactNode;
  overlayClassName?: string; // customize selection overlay lines
  scrollEndDelay?: number; // ms debounce for web scroll end detection
  showWebArrows?: boolean; // show increment/decrement chevrons on web
}

export const WheelPicker = React.forwardRef<any, WheelPickerProps>(
  (
    {
      options,
      value,
      defaultValue = 0,
      onChange,
      itemClassName,
      activeItemClassName = 'text-primary font-semibold',
      containerClassName,
      height,
      itemHeight = 36,
      enableScrollByTapOnItem = true,
      visibleItemCount,
      renderItem,
      overlayClassName,
      scrollEndDelay = 120,
      showWebArrows = true,
      ...rest
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [internalIndex, setInternalIndex] = React.useState(defaultValue);
    const index = isControlled ? value! : internalIndex; // committed value
    const [displayIndex, setDisplayIndex] = React.useState(index); // transient visual highlight
    React.useEffect(() => {
      setDisplayIndex(index);
    }, [index]);

    // Build data objects expected by library
    const data = React.useMemo(
      () =>
        options.map((opt, i) => ({
          value: i,
          label: String(opt),
          _raw: opt,
        })),
      [options]
    );

    // Derive visibleItemCount from height & itemHeight if not provided
    const derivedVisible = React.useMemo(() => {
      if (visibleItemCount && visibleItemCount % 2 === 1) return visibleItemCount;
      if (height) {
        const approx = Math.max(1, Math.floor(height / itemHeight));
        return approx % 2 === 1 ? approx : Math.max(1, approx - 1);
      }
      return 5; // default
    }, [visibleItemCount, height, itemHeight]);

    const pickerHeight = React.useMemo(
      () => (height ? height : derivedVisible * itemHeight),
      [height, derivedVisible, itemHeight]
    );

    const finalizingRef = React.useRef(false); // retained for potential future use
    // Tracking refs
    const debounceTimer = React.useRef<any>(null); // debounced commit timer
    const lastDerivedIndexRef = React.useRef<number | null>(null); // last index derived from any event
    const lastCommittedRef = React.useRef<number | null>(null); // last index we fired onChange for
    const lastChangingIndexRef = React.useRef<number | null>(null); // last index from onValueChanging
    const lastChangingAtRef = React.useRef<number>(0); // timestamp of last onValueChanging
    const scrollingRef = React.useRef(false); // whether wheel is actively scrolling
    const freezeUntilRef = React.useRef(0); // time until which we ignore post-commit jitter

    const commitIndex = React.useCallback(
      (derivedIndex: number) => {
        if (lastCommittedRef.current === derivedIndex) return;
        if (!isControlled) setInternalIndex(derivedIndex);
        lastCommittedRef.current = derivedIndex;
        onChange?.(derivedIndex, options[derivedIndex]);
        freezeUntilRef.current = Date.now() + 160; // ignore minor jitter shortly after commit
      },
      [isControlled, onChange, options]
    );

    const deriveIndexFromEvent = (e: any): number => {
      // Support different shapes across platforms
      const item = e?.item ?? e; // some builds might send item directly
      let derivedIndex: number | undefined = undefined;
      if (typeof item?.value === 'number') derivedIndex = item.value;
      else if (typeof e?.value === 'number') derivedIndex = e.value;
      // Fallback: locate by label text
      if (derivedIndex === undefined && item?.label != null) {
        const lbl = String(item.label);
        const found = options.findIndex((o) => String(o) === lbl);
        if (found >= 0) derivedIndex = found;
      }
      if (derivedIndex === undefined) derivedIndex = 0;
      if (derivedIndex < 0 || derivedIndex >= options.length) derivedIndex = 0;
      return derivedIndex;
    };

    const handleValueChanged = (e: any) => {
      finalizingRef.current = true;
      // Library fires at rest; treat as authoritative but only commit after ensuring scroll ended.
      const idx = deriveIndexFromEvent(e);
      lastDerivedIndexRef.current = idx;
      lastChangingIndexRef.current = idx;
      lastChangingAtRef.current = Date.now();
      scrollingRef.current = false;
      // Cancel any pending debounce and commit immediately (user released & settled)
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setDisplayIndex(idx);
      commitIndex(idx);
    };

    // Continuous updates: native -> commit instantly, web -> debounce finalize
    const handleValueChanging = (e: any) => {
      const idx = deriveIndexFromEvent(e);
      // Ignore jitter events right after a commit (web snapping bounce)
      if (Platform.OS === 'web' && Date.now() < freezeUntilRef.current) {
        return;
      }
      scrollingRef.current = true;
      lastDerivedIndexRef.current = idx;
      lastChangingIndexRef.current = idx;
      lastChangingAtRef.current = Date.now();
      // Only update display highlight; don't change committed index yet (prevents snap)
      setDisplayIndex(idx);
      // Web fallback: if no valueChanged event, commit after inactivity
      if (Platform.OS === 'web') {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          const idleFor = Date.now() - lastChangingAtRef.current;
          if (idleFor >= scrollEndDelay - 5) {
            scrollingRef.current = false;
            setDisplayIndex(idx);
            commitIndex(idx);
          }
        }, scrollEndDelay);
      }
    };

    React.useEffect(() => () => debounceTimer.current && clearTimeout(debounceTimer.current), []);

    // Arrow button logic (web only)
    const getVisualBaseIndex = React.useCallback(() => {
      if (lastDerivedIndexRef.current != null) return lastDerivedIndexRef.current;
      return displayIndex ?? index;
    }, [displayIndex, index]);

    const adjustIndex = React.useCallback(
      (delta: number) => {
        if (!options.length || delta === 0) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        const base = getVisualBaseIndex();
        let next = base + delta;
        if (next < 0) next = 0;
        else if (next >= options.length) next = options.length - 1;
        scrollingRef.current = false;
        freezeUntilRef.current = 0;
        lastDerivedIndexRef.current = next;
        lastChangingIndexRef.current = next;
        lastChangingAtRef.current = Date.now();
        setDisplayIndex(next);
        commitIndex(next);
      },
      [commitIndex, getVisualBaseIndex, options.length]
    );

    const handleDecrement = React.useCallback(() => adjustIndex(-1), [adjustIndex]);
    const handleIncrement = React.useCallback(() => adjustIndex(1), [adjustIndex]);

    const mutedForeground = useColor('muted-foreground');

    const renderOverlay = () => (
      <View
        pointerEvents="none"
        className={cn('absolute left-0 right-0 border-y border-border', overlayClassName)}
        style={{ top: (pickerHeight - itemHeight) / 2, height: itemHeight }}
      />
    );

    return (
      <View
        className={cn('relative items-stretch', containerClassName)}
        style={{ height: pickerHeight }}
      >
        <WheelPickerBase
          data={data}
          value={index}
          itemHeight={itemHeight}
          visibleItemCount={derivedVisible}
          enableScrollByTapOnItem={enableScrollByTapOnItem}
          onValueChanged={handleValueChanged}
          onValueChanging={handleValueChanging}
          renderItem={(params: any) => {
            const i = params?.index ?? params?.item?.value ?? 0;
            const active = i === displayIndex;
            if (renderItem) {
              const node = renderItem(options[i], active, i);
              // Ensure we always return an element; wrap primitives
              if (node === null || node === undefined || typeof node === 'boolean') {
                return <Text />;
              }
              if (
                typeof node === 'string' ||
                typeof node === 'number' ||
                typeof node === 'bigint'
              ) {
                return <Text>{String(node)}</Text>;
              }
              return node as React.ReactElement;
            }
            return (
              <Text
                className={cn(
                  'text-sm text-foreground text-center mt-2',
                  itemClassName,
                  active && activeItemClassName
                )}
              >
                {options[i] + ''}
              </Text>
            );
          }}
          {...rest}
        />
        {Platform.OS === 'web' && showWebArrows && (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous"
              onPress={handleDecrement}
              className="absolute top-1 left-1/2 -translate-x-1/2 z-10 p-1"
            >
              <ChevronUp size={16} color={mutedForeground} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next"
              onPress={handleIncrement}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 p-1"
            >
              <ChevronDown size={16} color={mutedForeground} />
            </Pressable>
          </>
        )}
      </View>
    );
  }
);

WheelPicker.displayName = 'WheelPicker';
