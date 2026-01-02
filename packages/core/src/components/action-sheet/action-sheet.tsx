import * as React from 'react';
import { View } from '../base/view';
import { Text } from '../base/text';
import { Pressable } from '../base/pressable';
import {
  BottomSheet as BottomSheetComponent,
  type BottomSheet as BottomSheetHandle,
} from '../bottom-sheet';
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
    const sheetRef = React.useRef<BottomSheetHandle>(null);
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
        if (controlledOpen) sheetRef.current?.show();
        else sheetRef.current?.hide();
      }
    }, [controlledOpen, isControlled]);

    React.useImperativeHandle(
      ref,
      () => ({
        show: () => {
          sheetRef.current?.show();
          setOpen(true);
        },
        hide: () => {
          sheetRef.current?.hide();
          setOpen(false);
        },
      }),
      [setOpen]
    );

    const handleActionPress = (action: ActionSheetAction) => {
      action.onPress?.();
      setOpen(false);
      sheetRef.current?.hide();
    };

    const handleCancel = () => {
      onCancel?.();
      setOpen(false);
      sheetRef.current?.hide();
    };

    return (
      <BottomSheetComponent
        ref={sheetRef}
        open={open}
        onOpenChange={(v) => setOpen(v)}
        contentClassName={cn('gap-2 rounded-xl', contentClassName)}
        disableElevation
        gestureEnabled
        indicatorStyle={{ display: 'none' }}
        containerStyle={{
          paddingHorizontal: 12,
          height: '40%',
          backgroundColor: 'transparent',
          paddingBottom: 30,
          bottom: 20,
        }}
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
      </BottomSheetComponent>
    );
  }
);

ActionSheet.displayName = 'ActionSheet';
