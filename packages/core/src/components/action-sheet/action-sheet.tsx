import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { Pressable } from '../base/pressable';
import { Modal, type ModalHandle } from '../modal/modal';
import { cn } from '../../lib/utils/utils';
import { Separator } from '../separator';

export interface ActionSheetAction {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export interface ActionSheetProps {
  title?: string;
  description?: string;
  actions?: ActionSheetAction[];
  cancelText?: string;
  onCancel?: () => void;
  open?: boolean; // controlled
  onOpenChange?: (open: boolean) => void;
  // styling
  contentClassName?: string;
  actionClassName?: string;
  actionTextClassName?: string;
  cancelClassName?: string;
  cancelTextClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  separatorClassName?: string;
}

export interface ActionSheetHandle {
  show: () => void;
  hide: () => void;
}

export const ActionSheet = React.forwardRef<ActionSheetHandle, ActionSheetProps>(
  (
    {
      title,
      description,
      actions = [],
      cancelText = 'Cancel',
      onCancel,
      open: controlledOpen,
      onOpenChange,
      contentClassName,
      actionClassName,
      actionTextClassName,
      cancelClassName,
      cancelTextClassName,
      titleClassName,
      descriptionClassName,
      separatorClassName,
    },
    ref
  ) => {
    const modalRef = React.useRef<ModalHandle>(null);
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(false);
    const open = isControlled ? controlledOpen! : internalOpen;

    const setOpen = React.useCallback(
      (v: boolean) => {
        if (!isControlled) setInternalOpen(v);
        onOpenChange?.(v);
      },
      [isControlled, onOpenChange]
    );

    React.useEffect(() => {
      if (isControlled) {
        if (controlledOpen) modalRef.current?.open();
        else modalRef.current?.close();
      }
    }, [controlledOpen, isControlled]);

    React.useImperativeHandle(
      ref,
      () => ({
        show: () => {
          modalRef.current?.open();
          setOpen(true);
        },
        hide: () => {
          modalRef.current?.close();
          setOpen(false);
        },
      }),
      [setOpen]
    );

    const handleActionPress = (action: ActionSheetAction) => {
      action.onPress?.();
      setOpen(false);
      modalRef.current?.close();
    };

    const handleCancel = () => {
      onCancel?.();
      setOpen(false);
      modalRef.current?.close();
    };

    return (
      <Modal
        ref={modalRef}
        onOpenChange={(v) => setOpen(v)}
        contentClassName={cn('bg-transparent p-0 border-none shadow-none', contentClassName)}
        overlayClassName="justify-end"
      >
        <View className="w-full gap-2">
          <View className="bg-card rounded-xl overflow-hidden">
            {(title || description) && (
              <View className="py-4 px-4 gap-1">
                {title && (
                  <Text className={cn('text-center text-sm font-medium', titleClassName)}>
                    {title}
                  </Text>
                )}
                {description && (
                  <Text
                    className={cn(
                      'text-center text-xs text-muted-foreground',
                      descriptionClassName
                    )}
                  >
                    {description}
                  </Text>
                )}
              </View>
            )}
            {actions.map((a, i) => {
              const disabled = a.disabled;
              return (
                <View key={i}>
                  {i === 0 && (title || description) && (
                    <Separator className={separatorClassName} />
                  )}
                  {i > 0 && <Separator className={separatorClassName} />}
                  <Pressable
                    disabled={disabled}
                    onPress={() => !disabled && handleActionPress(a)}
                    className={cn(
                      'py-4 px-4 flex-row items-center justify-center bg-card',
                      disabled && 'opacity-50',
                      a.className,
                      actionClassName
                    )}
                  >
                    {a.icon}
                    <Text
                      className={cn(
                        'text-sm font-semibold',
                        a.destructive && 'text-destructive',
                        a.textClassName,
                        actionTextClassName
                      )}
                    >
                      {a.label}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Pressable
            onPress={handleCancel}
            className={cn(
              'py-4 px-4 flex-row items-center justify-center bg-card rounded-xl',
              cancelClassName
            )}
          >
            <Text className={cn('text-sm font-semibold text-destructive', cancelTextClassName)}>
              {cancelText}
            </Text>
          </Pressable>
        </View>
      </Modal>
    );
  }
);

ActionSheet.displayName = 'ActionSheet';
