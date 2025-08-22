import { vars } from 'nativewind';
import * as React from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  ReactNode,
  ReactElement,
} from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  ModalProps,
  BackHandler,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeProvider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
type PlacementType = 'top' | 'bottom' | 'left' | 'right';

interface TriggerLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

interface ContentLayout {
  width: number;
  height: number;
}

interface Position {
  top: number;
  left: number;
}

interface PopoverArrowProps {
  placement: PlacementType;
  arrowSize: number;
  arrowColor: string;
}

interface PopoverProps extends Omit<ModalProps, 'visible' | 'children'> {
  children: ReactElement;
  content: ReactNode;
  placement?: PlacementType;
  openOnPress?: boolean;
  arrowSize?: number;
  arrowColor?: string;
  showArrow?: boolean;
  offset?: number;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  contentClassName?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
}

interface PopoverRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: boolean;
}

// Arrow component for the popover
const PopoverArrow: React.FC<PopoverArrowProps> = ({ placement, arrowSize, arrowColor }) => {
  const arrowPaths: Record<PlacementType, string> = {
    top: `M0,${arrowSize} L${arrowSize},0 L${arrowSize * 2},${arrowSize} Z`,
    bottom: `M0,0 L${arrowSize},${arrowSize} L${arrowSize * 2},0 Z`,
    left: `M${arrowSize},0 L0,${arrowSize} L${arrowSize},${arrowSize * 2} Z`,
    right: `M0,0 L${arrowSize},${arrowSize} L0,${arrowSize * 2} Z`,
  };

  return (
    <Svg width={arrowSize * 2} height={arrowSize * 2} style={styles.arrow}>
      <Path d={arrowPaths[placement]} fill={arrowColor} />
    </Svg>
  );
};

const Popover = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      children,
      content,
      placement = 'bottom',
      openOnPress = true,
      arrowSize = 6,
      arrowColor = '#FFFFFF',
      showArrow = true,
      offset = 0,
      disabled = false,
      onOpen,
      onClose,
      className,
      contentClassName,
      style,
      contentStyle,
      overlayStyle,
      animationType = 'fade',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [triggerLayout, setTriggerLayout] = useState<TriggerLayout | null>(null);
    const [contentLayout, setContentLayout] = useState<ContentLayout | null>(null);
    const [actualPlacement, setActualPlacement] = useState<PlacementType>(placement);

    const triggerRef = useRef<View>(null);

    // Calculate popover position based on trigger and content dimensions
    const popoverPosition = useMemo((): Position => {
      if (!triggerLayout || !contentLayout) return { top: 0, left: 0 };

      const { pageX, pageY, width: triggerWidth, height: triggerHeight } = triggerLayout;
      const { width: contentWidth, height: contentHeight } = contentLayout;

      let top = 0;
      let left = 0;
      let finalPlacement: PlacementType = placement;

      // Calculate initial position based on placement
      switch (placement) {
        case 'top':
          top = pageY - contentHeight - offset - (showArrow ? arrowSize : 0);
          left = pageX + (triggerWidth - contentWidth) / 2;
          break;
        case 'bottom':
          top = pageY + triggerHeight + offset + (showArrow ? arrowSize : 0);
          left = pageX + (triggerWidth - contentWidth) / 2;
          break;
        case 'left':
          top = pageY + (triggerHeight - contentHeight) / 2;
          left = pageX - contentWidth - offset - (showArrow ? arrowSize : 0);
          break;
        case 'right':
          top = pageY + (triggerHeight - contentHeight) / 2;
          left = pageX + triggerWidth + offset + (showArrow ? arrowSize : 0);
          break;
        default:
          top = pageY + triggerHeight + offset + (showArrow ? arrowSize : 0);
          left = pageX + (triggerWidth - contentWidth) / 2;
          finalPlacement = 'bottom';
      }

      // Auto-adjust placement if content goes off-screen
      const margin = 16; // Screen edge margin

      // Check if content goes off bottom of screen
      if (finalPlacement === 'bottom' && top + contentHeight > SCREEN_HEIGHT - margin) {
        finalPlacement = 'top';
        top = pageY - contentHeight - offset - (showArrow ? arrowSize : 0);
      }

      // Check if content goes off top of screen
      if (finalPlacement === 'top' && top < margin) {
        finalPlacement = 'bottom';
        top = pageY + triggerHeight + offset + (showArrow ? arrowSize : 0);
      }

      // Check if content goes off right side of screen
      if (finalPlacement === 'right' && left + contentWidth > SCREEN_WIDTH - margin) {
        finalPlacement = 'left';
        left = pageX - contentWidth - offset - (showArrow ? arrowSize : 0);
      }

      // Check if content goes off left side of screen
      if (finalPlacement === 'left' && left < margin) {
        finalPlacement = 'right';
        left = pageX + triggerWidth + offset + (showArrow ? arrowSize : 0);
      }

      // Keep content within horizontal bounds
      if (left < margin) {
        left = margin;
      } else if (left + contentWidth > SCREEN_WIDTH - margin) {
        left = SCREEN_WIDTH - contentWidth - margin;
      }

      // Keep content within vertical bounds
      if (top < margin) {
        top = margin;
      } else if (top + contentHeight > SCREEN_HEIGHT - margin) {
        top = SCREEN_HEIGHT - contentHeight - margin;
      }

      setActualPlacement(finalPlacement);

      return { top, left };
    }, [triggerLayout, contentLayout, placement, offset, arrowSize, showArrow]);

    // Measure trigger element
    const measureTrigger = useCallback((): void => {
      if (triggerRef.current) {
        triggerRef.current.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            setTriggerLayout({ pageX: x, pageY: y, width, height });
          }
        );
      }
    }, []);

    // Show popover
    const show = useCallback((): void => {
      if (disabled) return;

      measureTrigger();
      setIsVisible(true);
      onOpen?.();
    }, [disabled, measureTrigger, onOpen]);

    // Hide popover
    const hide = useCallback((): void => {
      setIsVisible(false);
      onClose?.();
    }, [onClose]);

    // Toggle popover
    const toggle = useCallback((): void => {
      if (isVisible) {
        hide();
      } else {
        show();
      }
    }, [isVisible, show, hide]);

    // Handle trigger press
    const handleTriggerPress = useCallback((): void => {
      if (openOnPress) {
        toggle();
      }
    }, [openOnPress, toggle]);

    // Handle content layout
    const handleContentLayout = useCallback((event: any): void => {
      const { width, height } = event.nativeEvent.layout;
      setContentLayout({ width, height });
    }, []);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      (): PopoverRef => ({
        show,
        hide,
        toggle,
        isVisible,
      }),
      [show, hide, toggle, isVisible]
    );

    // Close on back button (Android)
    useEffect(() => {
      if (Platform.OS === 'android' && isVisible) {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          hide();
          return true;
        });

        return () => backHandler.remove();
      }
    }, [isVisible, hide]);

    const triggerElement = React.cloneElement(children, {
      ref: triggerRef,
      onPress: handleTriggerPress,
      ...(children.props as any),
    });
    const currentTheme = useTheme();

    return (
      <>
        {triggerElement}
        <View className="absolute w-0 h-0">
          <Modal
            visible={isVisible}
            transparent
            statusBarTranslucent
            animationType={animationType}
            onRequestClose={hide}
            {...props}
          >
            <TouchableWithoutFeedback onPress={hide}>
              <View style={[styles.overlay, overlayStyle, vars(currentTheme)]}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View
                    style={[
                      styles.content,
                      {
                        top: popoverPosition.top,
                        left: popoverPosition.left,
                      },
                      contentStyle,
                    ]}
                    className="bg-card rounded-popover p-3 border border-border"
                    onLayout={handleContentLayout}
                  >
                    {content}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    maxWidth: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  arrowContainer: {
    position: 'absolute',
  },
  arrow: {},
});

export { Popover, PopoverRef };
