import { vars } from 'nativewind';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeProvider';
import { Arrow } from './Arrow';
import { usePopover } from './usePopover';
import { PopoverProps, PopoverRef } from './types';
import { Portal } from '../portal';
import { useRef } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { cn } from '../../lib/utils/utils';
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
      overlayClassName,
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
    const dimensions = useWindowDimensions();
    const popoverBody = (
      <TouchableWithoutFeedback onPress={hide}>
        <Animated.View
          style={[
            renderInPortal
              ? {
                  position: 'absolute',
                  flex: 1,
                  top: 0,
                  left: 0,
                  height: dimensions.height,
                  width: dimensions.width,
                  zIndex: 999,
                }
              : {},
            styles.overlay,
            overlayStyle,
            vars(currentTheme),
          ]}
          className={overlayClassName}
          entering={FadeIn.springify(20)}
          exiting={FadeOut.springify(20)}
        >
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  top: popoverPosition.top,
                  left: popoverPosition.left,
                  width: matchTriggerWidth && triggerLayout ? triggerLayout.width : undefined,
                },
                contentStyle,
              ]}
              className={cn('bg-card rounded-popover p-3 border border-border', contentClassName)}
              onLayout={handleContentLayout}
              entering={FadeIn.springify(20)}
              exiting={FadeOut.springify(20)}
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
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    );

    return (
      <>
        {triggerElement}
        {renderInPortal && (
          <Portal name={internalPortalNameRef.current} hostName={portalHostName}>
            {isVisible && <>{popoverBody}</>}
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
