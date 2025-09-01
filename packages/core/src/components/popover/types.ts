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
  overlayClassName?: string;
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
  /**
   * When true, the popover content width will automatically match the trigger's width.
   * This is useful for components like Select where the dropdown should align to the trigger.
   */
  matchTriggerWidth?: boolean;
  /**
   * Render popover using a Portal instead of a Modal. Requires a <PortalHost/> mounted.
   */
  renderInPortal?: boolean;
  /** Optional host name for the portal (defaults to internal default host). */
  portalHostName?: string;
  /** Optional specific portal name (auto-generated if omitted). */
  portalName?: string;
}

export interface PopoverRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: boolean;
}
