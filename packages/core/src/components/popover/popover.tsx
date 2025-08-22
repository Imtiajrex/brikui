import * as React from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PopoverArrow } from './Arrow';
import type {
  PopoverProps,
  PopoverRef,
  PopoverPosition,
  PopoverPlacement,
  Placement,
} from './types';
import { computePopoverPosition } from './computePosition';
import { useTheme } from '../../contexts/ThemeProvider';
import { vars } from 'nativewind';
export { PopoverRef };
type SpringConfig = { tension?: number; friction?: number };

const defaultSpringConfig = {
  damping: 12,
  mass: 1,
};
const defaultTimingConfig = { duration: 50, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) };

// Context for composability
interface InternalContext {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  arrow: boolean;
  arrowSize: number;
  placement: PopoverPlacement;
  actualPlacement: PopoverPlacement;
  triggerRef: React.RefObject<View>;
  triggerPosition: PopoverPosition;
  popoverPosition: { x: number; y: number };
  setContentSize: (s: { width: number; height: number }) => void;
  contentSize: { width: number; height: number };
  styles: { backdropStyle: any; popoverStyle: any };
  classNames: {
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    arrowClassName?: string;
    backdropClassName?: string;
  };
  contentStyle?: any;
  overlayStyle?: any;
  closeOnBackdropPress: boolean;
}
const PopoverCtx = React.createContext<InternalContext | null>(null);
const usePopoverContext = () => {
  const ctx = React.useContext(PopoverCtx);
  if (!ctx) throw new Error('Popover compound components must be used within <Popover.Root>');
  return ctx;
};

// Root (imperative + context)
export interface PopoverRootProps extends Omit<PopoverProps, 'children' | 'content'> {
  children?: React.ReactNode;
  content?: React.ReactNode; // allow inline usage
}

export interface PopoverHandle extends PopoverRef {}

export const PopoverRoot = forwardRef<PopoverHandle, PopoverRootProps>(
  (
    {
      children,
      content,
      placement = 'bottom',
      offset = 8,
      isVisible: controlledVisible,
      onVisibilityChange,
      triggerStyle,
      contentStyle,
      overlayStyle,
      animationConfig = defaultSpringConfig,
      closeOnBackdropPress = true,
      arrow = true,
      arrowSize = 8,
      disabled = false,
      className,
      triggerClassName,
      contentClassName,
      arrowClassName,
      backdropClassName,
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(false);
    const [triggerPosition, setTriggerPosition] = useState<PopoverPosition>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const [contentSize, setContentSize] = useState({ width: 200, height: 100 });
    const [actualPlacement, setActualPlacement] = useState<PopoverPlacement>(placement);

    const triggerRef = useRef<View>(null);

    const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;

    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    const popoverPosition = computePopoverPosition({
      triggerPosition,
      contentSize,
      placement: actualPlacement,
      offset,
      arrowSize: arrow ? arrowSize : 0,
    });

    // Measure trigger position (used both for imperative and controlled openings)
    const measureTrigger = useCallback(() => {
      if (!triggerRef.current) return;
      triggerRef.current.measureInWindow((x, y, width, height) => {
        // Retry once if layout not ready
        if (width === 0 && height === 0) {
          setTimeout(() => {
            triggerRef.current?.measureInWindow((x2, y2, w2, h2) => {
              if (w2 || h2) {
                setTriggerPosition({ x: x2, y: y2, width: w2, height: h2 });
                setActualPlacement(placement);
              }
            });
          }, 16);
          return;
        }
        setTriggerPosition({ x, y, width, height });
        setActualPlacement(placement);
      });
    }, [placement]);

    const animateIn = useCallback(() => {
      'worklet';
      scale.value = withSpring(1, animationConfig as any);
      opacity.value = withTiming(1, defaultTimingConfig);
    }, [scale, opacity, animationConfig]);

    const animateOut = useCallback(() => {
      'worklet';
      scale.value = withSpring(0, { ...(animationConfig as any), tension: 400 } as any);
      opacity.value = withTiming(0, defaultTimingConfig);
    }, [scale, opacity, animationConfig]);

    const show = useCallback(() => {
      if (disabled) return;
      measureTrigger();
      if (controlledVisible === undefined) {
        setInternalVisible(true);
      }
      onVisibilityChange?.(true);
    }, [disabled, controlledVisible, onVisibilityChange, measureTrigger]);

    const hide = useCallback(() => {
      if (controlledVisible === undefined) {
        setInternalVisible(false);
      }
      onVisibilityChange?.(false);
    }, [controlledVisible, onVisibilityChange]);

    const toggle = useCallback(() => {
      isVisible ? hide() : show();
    }, [isVisible, hide, show]);

    useImperativeHandle(
      ref,
      () => ({
        show,
        hide,
        toggle,
        isVisible,
      }),
      [show, hide, toggle, isVisible]
    );

    const tapGesture = Gesture.Tap().onEnd(() => {
      runOnJS(toggle)();
    });

    React.useEffect(() => {
      if (isVisible) {
        // Ensure position is measured when externally controlled open happens
        measureTrigger();
        animateIn();
      } else {
        animateOut();
      }
    }, [isVisible, animateIn, animateOut, measureTrigger]);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const popoverStyle = useAnimatedStyle(() => {
      const scaleValue = scale.value;

      return {
        position: 'absolute',
        left: popoverPosition.x,
        top: popoverPosition.y,
        opacity: opacity.value,
        transform: [{ scale: scaleValue }],
      };
    });

    const ctx: InternalContext = {
      open: isVisible,
      show,
      hide,
      toggle,
      arrow,
      arrowSize,
      placement,
      actualPlacement,
      triggerRef: triggerRef as React.RefObject<View>,
      triggerPosition,
      popoverPosition: { x: popoverPosition.x, y: popoverPosition.y },
      setContentSize,
      contentSize,
      styles: { backdropStyle, popoverStyle },
      classNames: {
        className,
        triggerClassName,
        contentClassName,
        arrowClassName,
        backdropClassName,
      },
      contentStyle,
      overlayStyle,
      closeOnBackdropPress,
    };

    return (
      <PopoverCtx.Provider value={ctx}>
        <GestureDetector gesture={tapGesture}>
          <View ref={triggerRef} style={triggerStyle} className={triggerClassName}>
            {children}
          </View>
        </GestureDetector>
        <PopoverPortal content={content} />
      </PopoverCtx.Provider>
    );
  }
);
PopoverRoot.displayName = 'Popover.Root';

// Portal / Content renderer
const PopoverPortal: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  const ctx = usePopoverContext();
  const {
    open,
    hide,
    classNames,
    styles,
    overlayStyle,
    contentStyle,
    handleBackdropPress,
    arrow,
    arrowSize,
    actualPlacement,
    triggerPosition,
    popoverPosition,
  } = React.useMemo(
    () => ({
      ...ctx,
      handleBackdropPress: () => ctx.closeOnBackdropPress && ctx.hide(),
    }),
    [ctx]
  );

  const { backdropStyle, popoverStyle } = styles;
  const { backdropClassName, className, contentClassName, arrowClassName } = classNames;

  const currentTheme = useTheme();
  if (!open) return null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={hide}>
      <View className="flex-1" style={vars(currentTheme)}>
        <Pressable
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            backdropStyle,
            overlayStyle,
          ]}
          className={backdropClassName}
          onPress={handleBackdropPress}
        />

        <Animated.View style={popoverStyle} className={className}>
          {arrow && (
            <PopoverArrow
              placement={actualPlacement}
              size={arrowSize}
              triggerPosition={triggerPosition}
              popoverPosition={popoverPosition}
              className={arrowClassName}
            />
          )}
          <View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              },
              contentStyle,
            ]}
            className={contentClassName}
            onLayout={(e) => ctx.setContentSize(e.nativeEvent.layout)}
          >
            {content}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Compound Content component for direct composition
export const PopoverContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const ctx = usePopoverContext();
  return <PopoverPortal content={children} />;
};

// Shorthand Popover still available
export interface ShorthandPopoverProps extends PopoverProps {}
export const Popover = React.forwardRef<PopoverRef, ShorthandPopoverProps>((props, ref) => {
  const { content, children, ...rest } = props as any;
  return (
    <PopoverRoot ref={ref as any} {...rest} content={content}>
      {children}
    </PopoverRoot>
  );
});
Popover.displayName = 'Popover';

export { type Placement };
