import * as React from 'react';
import { Modal } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn } from '../../lib/utils/utils';
import { Pressable } from '../base/pressable';
import { Text } from '../base/text';
import { View } from '../base/view';
import { Button } from '../button/button';

type ActionConfig = {
  text: string;
  onPress?: () => void;
  variant?: React.ComponentProps<typeof Button>['variant'];
};

export type AlertDialogBaseProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirm?: ActionConfig;
  cancel?: ActionConfig;
  hideOnConfirm?: boolean;
  hideOnCancel?: boolean;
  backdropClassName?: string;
  contentClassName?: string;
  /** Provide a name for the Portal when using multiple hosts */
  portalName?: string;
  /** If true disables closing via backdrop */
  disableBackdropClose?: boolean;
};

export type AlertDialogProps = AlertDialogBaseProps & {
  isOpen?: boolean; // controlled
  setIsOpen?: (open: boolean) => void;
};

export type AlertDialogHandle = {
  show: (options?: Partial<AlertDialogBaseProps>) => void;
  hide: () => void;
};

function InternalContent({
  title,
  description,
  confirm,
  cancel,
  onClose,
  hideOnCancel = true,
  hideOnConfirm = true,
  contentClassName,
}: AlertDialogBaseProps & { onClose: () => void }) {
  return (
    <View
      className={cn(
        'w-[90%] max-w-md rounded-lg border z-50 border-border bg-card p-6 gap-4',
        contentClassName
      )}
    >
      {title ? (
        typeof title === 'string' || typeof title === 'number' ? (
          <Text className="text-lg font-semibold leading-none">{title}</Text>
        ) : (
          title
        )
      ) : null}
      {description ? (
        typeof description === 'string' || typeof description === 'number' ? (
          <Text className="text-sm text-muted-foreground leading-snug">{description}</Text>
        ) : (
          description
        )
      ) : null}
      <View className="flex-row justify-end gap-3 pt-2">
        {cancel ? (
          <Button
            size="sm"
            variant={cancel.variant ?? 'outline'}
            onPress={() => {
              cancel.onPress?.();
              if (hideOnCancel) onClose();
            }}
          >
            {cancel.text}
          </Button>
        ) : null}
        {confirm ? (
          <Button
            size="sm"
            variant={confirm.variant ?? 'default'}
            onPress={() => {
              confirm.onPress?.();
              if (hideOnConfirm) onClose();
            }}
          >
            {confirm.text}
          </Button>
        ) : null}
      </View>
    </View>
  );
}

const AlertDialog = React.forwardRef<AlertDialogHandle, AlertDialogProps>(
  (
    {
      isOpen: controlledOpen,
      setIsOpen,
      title,
      description,
      confirm = { text: 'Confirm' },
      cancel = { text: 'Cancel', variant: 'outline' },
      hideOnConfirm,
      hideOnCancel,
      backdropClassName,
      contentClassName,
      portalName = 'ALERT_DIALOG',
      disableBackdropClose,
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(false); // local open state when uncontrolled
    const requestedOpen = controlledOpen ?? uncontrolled;

    // Internal visibility state (kept true until exit animation finishes)
    const [visible, setVisible] = React.useState(requestedOpen);

    // progress 0 -> 1
    const progress = useSharedValue(requestedOpen ? 1 : 0);

    React.useEffect(() => {
      if (requestedOpen) {
        setVisible(true);
        progress.value = withTiming(1, { duration: 180 });
      } else {
        // animate out then hide
        progress.value = withTiming(0, { duration: 150 }, (finished) => {
          if (finished) {
            // run on JS thread
            requestAnimationFrame(() => setVisible(false));
          }
        });
      }
    }, [requestedOpen, progress]);

    const close = React.useCallback(() => {
      setIsOpen ? setIsOpen(false) : setUncontrolled(false);
    }, [setIsOpen]);
    const show = React.useCallback(
      (options?: Partial<AlertDialogBaseProps>) => {
        if (options) {
          // dynamic option merging could be added here
        }
        setIsOpen ? setIsOpen(true) : setUncontrolled(true);
      },
      [setIsOpen]
    );

    React.useImperativeHandle(ref, () => ({ show, hide: close }), [show, close]);

    const contentAnimated = useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [
        {
          scale: progress.value * 0.05 + 0.95, // 0.95 -> 1
        },
      ],
    }));

    if (!visible) return null;

    return (
      <Modal transparent visible={visible} onRequestClose={close} animationType="fade">
        <Animated.View
          style={contentAnimated}
          className="w-full items-center z-50 flex-1 justify-center absolute h-full"
        >
          <InternalContent
            title={title}
            description={description}
            confirm={confirm}
            cancel={cancel}
            hideOnConfirm={hideOnConfirm}
            hideOnCancel={hideOnCancel}
            contentClassName={contentClassName}
            onClose={close}
          />
        </Animated.View>
        <Pressable
          className=" absolute top-0 left-0 flex-1 w-full h-full -z-10 bg-black/50"
          onPress={() => {
            if (!disableBackdropClose) close();
          }}
        />
      </Modal>
    );
  }
);

AlertDialog.displayName = 'AlertDialog';

export { AlertDialog };
