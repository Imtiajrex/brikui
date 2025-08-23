import { ReactNode, ReactElement } from 'react';
import { ModalProps, ViewStyle } from 'react-native';

export type PlacementType = 'top' | 'bottom' | 'left' | 'right';

export interface TriggerLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

export interface ContentLayout {
  width: number;
  height: number;
}

export interface Position {
  top: number;
  left: number;
}

export interface PopoverProps extends Omit<ModalProps, 'visible' | 'children'> {
  children: ReactElement;
  content: ReactNode;
  placement?: PlacementType;
  openOnPress?: boolean;
  arrowSize?: number;
  arrowColor?: string;
  showArrow?: boolean;
  offset?: number;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  contentClassName?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
}

export interface PopoverRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: boolean;
}
