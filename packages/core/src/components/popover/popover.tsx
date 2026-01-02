import * as React from 'react';
import ActionSheet, { ActionSheetRef, type ActionSheetProps } from 'react-native-actions-sheet';
import { Text, View } from 'react-native';

import {
  Popover as PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  PopoverRef,
} from '../../primitives/popover';

type UIPopoverContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof PopoverContent>,
  'children'
>;

type UIPopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type UIPopoverRootProps = React.ComponentPropsWithoutRef<typeof PopoverRoot>;

type FloatingSheetProps = ActionSheetProps & {
  contentStyle?: React.ComponentProps<typeof View>['style'];
};

type UIPopoverProps =
  | (UIPopoverRootProps & {
      /** Default popover rendering. */
      type?: 'popover';
      content: React.ReactNode;
      contentProps?: UIPopoverContentProps;
      triggerProps?: UIPopoverTriggerProps;
    })
  | ({
      /** Floating bottom sheet rendering via react-native-actions-sheet. */
      type: 'floating-sheet';
      content?: React.ReactNode;
      sheetProps?: FloatingSheetProps;
      triggerProps?: { onPress?: (event: unknown) => void };
    } & { children: React.ReactNode });

const FloatingSheet = ({
  content,
  sheetProps,
  children,
  triggerProps,
}: {
  content?: React.ReactNode;
  sheetProps?: FloatingSheetProps;
  children: React.ReactNode;
  triggerProps?: { onPress?: (event: unknown) => void };
}) => {
  const sheetRef = React.useRef<ActionSheetRef>(null);

  const trigger = React.isValidElement(children)
    ? (() => {
        const child = children as React.ReactElement<{
          onPress?: (event: unknown) => void;
        }>;
        return React.cloneElement(child, {
          onPress: (event: unknown) => {
            child.props?.onPress?.(event);
            triggerProps?.onPress?.(event);
            sheetRef.current?.show();
          },
        });
      })()
    : children;

  return (
    <>
      {trigger}
      <ActionSheet
        ref={sheetRef}
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
        {...sheetProps}
      >
        {content}
      </ActionSheet>
    </>
  );
};

const Popover = React.forwardRef<PopoverRef, React.PropsWithChildren<UIPopoverProps>>(
  (props, ref) => {
    if (props.type === 'floating-sheet') {
      React.useImperativeHandle(ref, () => null as any);

      return (
        <FloatingSheet
          content={props.content}
          sheetProps={props.sheetProps}
          triggerProps={props.triggerProps}
        >
          {props.children}
        </FloatingSheet>
      );
    }

    const { content, children, contentProps, triggerProps, ...rootProps } = props;

    return (
      <PopoverRoot {...rootProps}>
        <PopoverTrigger ref={ref} {...triggerProps}>
          {children}
        </PopoverTrigger>
        <PopoverContent {...contentProps}>{content}</PopoverContent>
      </PopoverRoot>
    );
  }
);

Popover.displayName = 'Popover';

export { Popover, PopoverContent, PopoverTrigger };
