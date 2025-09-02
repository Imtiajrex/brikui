import { useCallback, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentLayout, PlacementType, PopoverRef, TriggerLayout } from './types';
import { computePopoverPosition } from './positioning';
import { Platform, View } from 'react-native';

export interface UsePopoverOptions {
  placement: PlacementType;
  offset: number;
  arrowSize: number;
  showArrow: boolean;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  /**
   * When true (default) the popover will avoid screen edges (flip + clamp).
   */
  avoidScreenEdges?: boolean;
}

export const usePopover = ({
  placement,
  offset,
  arrowSize,
  showArrow,
  disabled,
  onOpen,
  onClose,
  avoidScreenEdges = true,
}: UsePopoverOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<TriggerLayout | null>(null);
  const [contentLayout, setContentLayout] = useState<ContentLayout | null>(null);
  const [actualPlacement, setActualPlacement] = useState<PlacementType>(placement);
  const triggerRef = useRef<View>(null);
  const insets = useSafeAreaInsets();

  const measureTrigger = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        const offset = Platform.OS === 'android' ? insets.top * 2.1 : insets.top * 1.8;
        setTriggerLayout({ pageX: x, pageY: y + offset, width, height });
      });
    }
  }, [insets.top]);

  const show = useCallback(() => {
    if (disabled) return;
    measureTrigger();
    setIsVisible(true);
    onOpen?.();
  }, [disabled, measureTrigger, onOpen]);

  const hide = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    isVisible ? hide() : show();
  }, [isVisible, hide, show]);

  const handleContentLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setContentLayout({ width, height });
  }, []);

  const popoverPosition = useMemo(
    () =>
      computePopoverPosition({
        triggerLayout,
        contentLayout,
        placement,
        offset,
        arrowSize,
        showArrow,
        setActualPlacement,
        avoidScreenEdges,
      }),
    [triggerLayout, contentLayout, placement, offset, arrowSize, showArrow, avoidScreenEdges]
  );

  const api: PopoverRef = {
    show,
    hide,
    toggle,
    isVisible,
  };

  return {
    // state
    isVisible,
    triggerLayout,
    contentLayout,
    actualPlacement,
    popoverPosition,
    // refs
    triggerRef,
    // handlers
    show,
    hide,
    toggle,
    handleContentLayout,
    // api
    api,
  };
};
