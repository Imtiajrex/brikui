import { remapProps } from 'nativewind';
import { forwardRef, ReactNode, useEffect, useRef, useState, useImperativeHandle } from 'react';
import ActionSheet, { ActionSheetProps, ActionSheetRef } from 'react-native-actions-sheet';
import { useColor } from '../../lib/hooks/useColor';
import { cn } from '../../lib/utils/utils';
import { Text, View } from '../base';

remapProps(ActionSheet, {
  containerClassName: 'containerStyle',
});
export type BottomSheetProps = ActionSheetProps & {
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  titleClassName?: string;
};
export type BottomSheet = ActionSheetRef;
export const BottomSheet = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
  const {
    open: controlledOpen,
    onOpenChange,
    title,
    children,
    contentClassName,
    containerClassName,
    titleClassName,
    ...rest
  } = props;

  const internalRef = useRef<ActionSheetRef>(null);
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(controlledOpen ?? false);

  // Sync when switching to controlled (edge case)
  useEffect(() => {
    if (isControlled) {
      if (controlledOpen) internalRef.current?.show();
      else internalRef.current?.hide();
    }
  }, [controlledOpen, isControlled]);

  const handleOpen = () => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  };
  const handleClose = () => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  useImperativeHandle(ref, () => (internalRef.current as ActionSheetRef) ?? ({} as ActionSheetRef));

  return (
    <ActionSheet
      ref={internalRef}
      onOpen={handleOpen}
      onClose={handleClose}
      gestureEnabled
      containerClassName={cn('bg-background', containerClassName)}
      containerStyle={{
        backgroundColor: useColor('background'),
      }}
      {...rest}
    >
      <View className={cn('bg-background px-4 pb-4 pt-2 gap-2', contentClassName)}>
        {title ? (
          <Text className={cn('text-center text-base font-medium mb-1', titleClassName)}>
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </ActionSheet>
  );
});
