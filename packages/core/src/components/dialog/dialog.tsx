import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { Pressable } from '../base/pressable';
import { Button } from '../button/button';
import { cn } from '../../lib/utils/utils';
import { Modal } from '../modal';

export interface DialogHandle {
  open: () => void;
  close: () => void;
}

export interface DialogProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional custom header node. When provided it overrides title/description rendering (but close button still shows unless showClose=false). */
  header?: React.ReactNode;
  /** Optional custom footer node. When provided it overrides default footer. */
  footer?: React.ReactNode;
  children?: React.ReactNode; // main body content (form etc.)
  disableBackdropClose?: boolean;
  animationDuration?: number;
  overlayClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  onOpenChange?: (open: boolean) => void;
  /** Show builtin close button (top-right) */
  showClose?: boolean;
  /** Text for default primary action if footer not provided */
  primaryActionText?: string;
  /** Called when primary action pressed (only if footer not provided) */
  onPrimaryAction?: () => void;
  /** Text for default cancel button */
  cancelText?: string;
  bodyClassName?: string; // additional class name for body container
  contentWrapperClassName?: string; // additional class name for content wrapper
}

export const Dialog = React.forwardRef<DialogHandle, DialogProps>(
  (
    {
      title,
      description,
      header,
      footer,
      children,
      contentWrapperClassName,
      disableBackdropClose,
      animationDuration,
      overlayClassName,
      containerClassName,
      contentClassName,
      onOpenChange,
      showClose = true,
      primaryActionText = 'Save changes',
      onPrimaryAction,
      cancelText = 'Cancel',
      bodyClassName,
    },
    ref
  ) => {
    const modalRef = React.useRef<{ open: () => void; close: () => void } | null>(null);

    const open = React.useCallback(() => {
      modalRef.current?.open();
      onOpenChange?.(true);
    }, [onOpenChange]);

    const close = React.useCallback(() => {
      modalRef.current?.close();
      onOpenChange?.(false);
    }, [onOpenChange]);

    React.useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const handlePrimary = React.useCallback(() => {
      onPrimaryAction?.();
      close();
    }, [onPrimaryAction, close]);

    const defaultHeader = (title || description) && (
      <View className="flex flex-col space-y-2">
        {title && <Text className="text-lg font-semibold leading-none">{title}</Text>}
        {description && (
          <Text className="text-sm text-muted-foreground" numberOfLines={4}>
            {description}
          </Text>
        )}
      </View>
    );

    const defaultFooter = (
      <View className="flex flex-row justify-end gap-2 pt-2">
        <Button variant="outline" onPress={close}>
          {cancelText}
        </Button>
        <Button onPress={handlePrimary}>{primaryActionText}</Button>
      </View>
    );

    return (
      <Modal
        ref={modalRef}
        disableBackdropClose={disableBackdropClose}
        animationDuration={animationDuration}
        overlayClassName={overlayClassName}
        containerClassName={containerClassName}
        contentClassName={cn('gap-6', contentClassName)}
        contentWrapperClassName={contentWrapperClassName}
        onOpenChange={onOpenChange}
      >
        <View className="w-full">
          {/* Header */}
          <View className="pb-2 pr-6">{header ?? defaultHeader}</View>
          {showClose && (
            <Pressable
              accessibilityRole="button"
              onPress={close}
              className="absolute top-3 right-3 h-8 w-8 items-center justify-center rounded-md active:opacity-70"
            >
              <Text className="text-xl leading-none">×</Text>
            </Pressable>
          )}
        </View>
        {/* Body */}
        {children && <View className={cn('w-full gap-4 flex-1', bodyClassName)}>{children}</View>}
        {/* Footer */}
        {footer ? <View className="w-full">{footer}</View> : defaultFooter}
      </Modal>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
