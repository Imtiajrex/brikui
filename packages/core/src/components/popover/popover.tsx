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
import { Portal } from '../portal';
import { useRef } from 'react';

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
      renderInPortal = false,
      portalHostName,
      portalName,
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

    const internalPortalNameRef = useRef(
      portalName || `popover-${Math.random().toString(36).slice(2)}`
    );

    const popoverBody = (
      <TouchableWithoutFeedback onPress={hide}>
        <View style={[styles.overlay, overlayStyle, vars(currentTheme)]} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.content,
                {
                  top: popoverPosition.top,
                  left: popoverPosition.left,
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
    );

    return (
      <>
        {triggerElement}
        {isVisible && renderInPortal && (
          <Portal name={internalPortalNameRef.current} hostName={portalHostName}>
            {popoverBody}
          </Portal>
        )}
        <View className="absolute w-0 h-0">
          {!renderInPortal && (
            <Modal
              visible={isVisible}
              transparent
              animationType={animationType}
              onRequestClose={hide}
              {...props}
            >
              {popoverBody}
            </Modal>
          )}
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
