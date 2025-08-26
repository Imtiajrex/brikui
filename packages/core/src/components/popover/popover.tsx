import { vars } from 'nativewind';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  BackHandler,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeProvider';
import { Arrow } from './Arrow';
import { usePopover } from './usePopover';
import { PopoverProps, PopoverRef } from './types';

const Popover = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      children,
      content,
      placement = 'bottom',
      openOnPress = true,
      arrowSize = 6,
      arrowColor = '#FFFFFF',
      showArrow = false,
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
      matchTriggerWidth = false,
      ...props
    },
    ref
  ) => {
    const {
      isVisible,
      actualPlacement,
      popoverPosition,
      triggerLayout,
      triggerRef,
      show,
      hide,
      toggle,
      handleContentLayout,
      contentLayout,
    } = usePopover({
      placement,
      offset,
      arrowSize,
      showArrow,
      disabled,
      onOpen,
      onClose,
    });

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
      onPress: (e: any) => {
        if (openOnPress) toggle();
        if (typeof (children.props as any).onPress === 'function') {
          (children.props as any).onPress(e);
        }
      },
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
                        // If matching trigger width, use triggerLayout width (minus borders if desired)
                        width: matchTriggerWidth && triggerLayout ? triggerLayout.width : undefined,
                      },
                      contentStyle,
                    ]}
                    className="bg-card rounded-popover p-3 border border-border"
                    onLayout={handleContentLayout}
                  >
                    {showArrow && (
                      <Arrow
                        placement={actualPlacement}
                        size={arrowSize}
                        color={arrowColor}
                        contentLayout={contentLayout}
                      />
                    )}
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
    // Dimensions applied at runtime for clamping
  },
  arrowContainer: {
    position: 'absolute',
  },
  arrow: {},
});

export { Popover, PopoverRef };
