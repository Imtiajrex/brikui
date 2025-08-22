import * as React from 'react';
import { cn } from '../../lib/utils/utils';
import { Text } from '../base/text';
import { View } from '../base/view';
import { Button } from '../button/button';
import { Modal } from '../modal';

export type AlertDialogHandle = {
  open: () => void;
  close: () => void;
};

export type AlertDialogProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  disableBackdropClose?: boolean;
  animationDuration?: number;
  contentClassName?: string;
  overlayClassName?: string;
  containerClassName?: string;
  onOpenChange?: (open: boolean) => void;
};

// Imperative AlertDialog built on top of imperative Modal
export const AlertDialog = React.forwardRef<AlertDialogHandle, AlertDialogProps>(
  (
    {
      title,
      description,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      disableBackdropClose = false,
      animationDuration = 180,
      contentClassName,
      overlayClassName,
      containerClassName,
      onOpenChange,
    },
    ref
  ) => {
    const modalRef = React.useRef<{ open: () => void; close: () => void } | null>(null);

    const openModal = React.useCallback(() => {
      modalRef.current?.open();
      onOpenChange?.(true);
    }, [onOpenChange]);

    const closeModal = React.useCallback(() => {
      modalRef.current?.close();
      onOpenChange?.(false);
    }, [onOpenChange]);

    React.useImperativeHandle(
      ref,
      () => ({
        open: openModal,
        close: closeModal,
      }),
      [openModal, closeModal]
    );

    const handleConfirm = React.useCallback(() => {
      onConfirm?.();
      closeModal();
    }, [onConfirm, closeModal]);

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      closeModal();
    }, [onCancel, closeModal]);

    return (
      <Modal
        ref={modalRef}
        disableBackdropClose={disableBackdropClose}
        animationDuration={animationDuration}
        overlayClassName={overlayClassName}
        containerClassName={containerClassName}
        contentClassName={cn('gap-4', contentClassName)}
        onOpenChange={onOpenChange}
      >
        {(title || description) && (
          <View className="flex flex-col space-y-2 text-center sm:text-left">
            {title && <Text className="text-lg font-semibold">{title}</Text>}
            {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
          </View>
        )}
        <View className="flex flex-row justify-end gap-2 pt-2">
          <Button variant="outline" onPress={handleCancel}>
            {cancelText}
          </Button>
          <Button onPress={handleConfirm}>{confirmText}</Button>
        </View>
      </Modal>
    );
  }
);

AlertDialog.displayName = 'AlertDialog';
