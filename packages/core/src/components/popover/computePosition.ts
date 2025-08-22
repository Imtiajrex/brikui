import type { PopoverPlacement, PopoverPosition } from './types';
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getStatusBarHeight = () => (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0);

export interface ComputePopoverPositionArgs {
  triggerPosition: PopoverPosition;
  contentSize: { width: number; height: number };
  placement: PopoverPlacement;
  offset: number;
  arrowSize: number;
  padding?: number;
}

export function computePopoverPosition({
  triggerPosition,
  contentSize,
  placement,
  offset,
  arrowSize,
  padding = 16,
}: ComputePopoverPositionArgs) {
  const statusBarHeight = getStatusBarHeight();
  const safeScreenHeight = screenHeight - statusBarHeight;
  let x = 0;
  let y = 0;
  let actualPlacement = placement;

  switch (placement) {
    case 'top':
      x = triggerPosition.x + triggerPosition.width / 2 - contentSize.width / 2;
      y = triggerPosition.y - contentSize.height - offset - arrowSize;
      break;
    case 'top-start':
      x = triggerPosition.x;
      y = triggerPosition.y - contentSize.height - offset - arrowSize;
      break;
    case 'top-end':
      x = triggerPosition.x + triggerPosition.width - contentSize.width;
      y = triggerPosition.y - contentSize.height - offset - arrowSize;
      break;
    case 'bottom':
      x = triggerPosition.x + triggerPosition.width / 2 - contentSize.width / 2;
      y = triggerPosition.y + triggerPosition.height + offset + arrowSize;
      break;
    case 'bottom-start':
      x = triggerPosition.x;
      y = triggerPosition.y + triggerPosition.height + offset + arrowSize;
      break;
    case 'bottom-end':
      x = triggerPosition.x + triggerPosition.width - contentSize.width;
      y = triggerPosition.y + triggerPosition.height + offset + arrowSize;
      break;
    case 'left':
      x = triggerPosition.x - contentSize.width - offset - arrowSize;
      y = triggerPosition.y + triggerPosition.height / 2 - contentSize.height / 2;
      break;
    case 'left-start':
      x = triggerPosition.x - contentSize.width - offset - arrowSize;
      y = triggerPosition.y;
      break;
    case 'left-end':
      x = triggerPosition.x - contentSize.width - offset - arrowSize;
      y = triggerPosition.y + triggerPosition.height - contentSize.height;
      break;
    case 'right':
      x = triggerPosition.x + triggerPosition.width + offset + arrowSize;
      y = triggerPosition.y + triggerPosition.height / 2 - contentSize.height / 2;
      break;
    case 'right-start':
      x = triggerPosition.x + triggerPosition.width + offset + arrowSize;
      y = triggerPosition.y;
      break;
    case 'right-end':
      x = triggerPosition.x + triggerPosition.width + offset + arrowSize;
      y = triggerPosition.y + triggerPosition.height - contentSize.height;
      break;
  }

  if (x < padding) x = padding;
  else if (x + contentSize.width > screenWidth - padding)
    x = screenWidth - contentSize.width - padding;

  if (y < statusBarHeight + padding) {
    if (placement.includes('top')) {
      y = triggerPosition.y + triggerPosition.height + offset + arrowSize;
      actualPlacement = placement.replace('top', 'bottom') as PopoverPlacement;
    } else {
      y = statusBarHeight + padding;
    }
  } else if (y + contentSize.height > safeScreenHeight - padding) {
    if (placement.includes('bottom')) {
      y = triggerPosition.y - contentSize.height - offset - arrowSize;
      actualPlacement = placement.replace('bottom', 'top') as PopoverPlacement;
    } else {
      y = safeScreenHeight - contentSize.height - padding;
    }
  }

  return { x, y, actualPlacement };
}
