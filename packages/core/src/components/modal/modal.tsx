import * as React from 'react';
import { Modal as RNModal } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn } from '../../lib/utils/utils';
import { Pressable } from '../base/pressable';
import { View } from '../base/view';
import { vars } from 'nativewind';
import { useTheme } from '../../contexts/ThemeProvider';

// Imperative-only Modal (no compound/composable API)
export interface ModalProps {
  children?: React.ReactNode;
  disableBackdropClose?: boolean;
  animationDuration?: number;
  overlayClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export interface ModalHandle {
  open: () => void;
  close: () => void;
}

const useModalAnimation = (isOpen: boolean, duration = 180) => {
  const [visible, setVisible] = React.useState(isOpen);
  const progress = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    if (isOpen) {
      setVisible(true);
      progress.value = withTiming(1, { duration });
    } else {
      progress.value = withTiming(0, { duration: duration * 0.8 }, (finished) => {
        if (finished) requestAnimationFrame(() => setVisible(false));
      });
    }
  }, [isOpen, progress, duration]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const contentWrapperStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value * 0.05 + 0.95 }],
  }));

  return { visible, overlayStyle, contentWrapperStyle };
};

export const Modal = React.forwardRef<ModalHandle, ModalProps>(
  (
    {
      children,
      disableBackdropClose = false,
      animationDuration = 180,
      overlayClassName,
      containerClassName,
      contentClassName,
      onOpenChange,
    },
    ref
  ) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { visible, overlayStyle, contentWrapperStyle } = useModalAnimation(
      open,
      animationDuration
    );

    const setIsOpen = React.useCallback(
      (next: boolean) => {
        setOpen(next);
        onOpenChange?.(next);
      },
      [onOpenChange]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }),
      [setIsOpen]
    );

    const handleBackdropPress = React.useCallback(() => {
      if (!disableBackdropClose) setIsOpen(false);
    }, [disableBackdropClose, setIsOpen]);

    const handleRequestClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

    if (!visible) return null;

    return (
      <RNModal
        transparent
        visible={visible}
        onRequestClose={handleRequestClose}
        animationType="none"
      >
        <View style={vars(theme)} className={cn('flex-1', containerClassName)}>
          {/* Backdrop */}
          <Animated.View
            style={overlayStyle}
            className={cn('absolute inset-0 bg-black/50', overlayClassName)}
          />
          <Pressable className="absolute inset-0" onPress={handleBackdropPress} />
          {/* Centered content */}
          <Animated.View
            style={contentWrapperStyle}
            className="flex-1 items-center justify-center px-4"
          >
            <View
              className={cn(
                'relative bg-card border border-border rounded-lg p-6 shadow-xl w-[90%] max-w-md',
                contentClassName
              )}
            >
              {children}
            </View>
          </Animated.View>
        </View>
      </RNModal>
    );
  }
);

Modal.displayName = 'Modal';

export { useModalAnimation };
