import type { ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface PopoverPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  placement?: PopoverPlacement;
  offset?: number;
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  triggerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  animationConfig?: {
    tension?: number;
    friction?: number;
    duration?: number;
  };
  closeOnOutsidePress?: boolean;
  closeOnBackdropPress?: boolean;
  arrow?: boolean;
  arrowSize?: number;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
  backdropClassName?: string;
}

export interface PopoverRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: boolean;
}

export interface PopoverContextValue {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<any>;
  triggerPosition: PopoverPosition;
  contentSize: { width: number; height: number };
  setContentSize: (s: { width: number; height: number }) => void;
  placement: PopoverPlacement;
  actualPlacement: PopoverPlacement;
  position: { x: number; y: number };
  arrow: boolean;
  arrowSize: number;
  closeOnBackdropPress: boolean;
  styles: {
    backdropStyle: any;
    popoverStyle: any;
  };
  classNames: {
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    arrowClassName?: string;
    backdropClassName?: string;
  };
  contentStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  disabled?: boolean;
}

export type Placement = PopoverPlacement;
