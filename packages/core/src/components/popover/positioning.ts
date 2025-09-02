import { PlacementType, TriggerLayout, ContentLayout, Position } from './types';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ComputePositionArgs {
  triggerLayout: TriggerLayout | null;
  contentLayout: ContentLayout | null;
  placement: PlacementType;
  offset: number;
  arrowSize: number;
  showArrow: boolean;
  margin?: number;
  setActualPlacement?: (p: PlacementType) => void;
  /**
   * When true (default) we avoid screen edges via flipping and clamping.
   * When false we return the raw calculated position without adjustments.
   */
  avoidScreenEdges?: boolean;
}

export const computePopoverPosition = ({
  triggerLayout,
  contentLayout,
  placement,
  offset,
  arrowSize,
  showArrow,
  margin = 16,
  setActualPlacement,
  avoidScreenEdges = true,
}: ComputePositionArgs): Position => {
  if (!triggerLayout || !contentLayout) return { top: 0, left: 0 };

  const { pageX, pageY, width: triggerWidth, height: triggerHeight } = triggerLayout;
  const { width: contentWidth, height: contentHeight } = contentLayout;

  let top = 0;
  let left = 0;
  let finalPlacement: PlacementType = placement;
  const arrowGap = showArrow ? arrowSize : 0;

  switch (placement) {
    case 'top':
      top = pageY - contentHeight - offset - arrowGap;
      left = pageX + (triggerWidth - contentWidth) / 2;
      break;
    case 'bottom':
      top = pageY + triggerHeight + offset + arrowGap;
      left = pageX + (triggerWidth - contentWidth) / 2;
      break;
    case 'left':
      top = pageY + (triggerHeight - contentHeight) / 2;
      left = pageX - contentWidth - offset - arrowGap;
      break;
    case 'right':
      top = pageY + (triggerHeight - contentHeight) / 2;
      left = pageX + triggerWidth + offset + arrowGap;
      break;
    default:
      finalPlacement = 'bottom';
      top = pageY + triggerHeight + offset + arrowGap;
      left = pageX + (triggerWidth - contentWidth) / 2;
  }

  if (avoidScreenEdges) {
    // Vertical adjustments
    if (finalPlacement === 'bottom' && top + contentHeight > SCREEN_HEIGHT - margin) {
      finalPlacement = 'top';
      top = pageY - contentHeight - offset - arrowGap;
    }
    if (finalPlacement === 'top' && top < margin) {
      finalPlacement = 'bottom';
      top = pageY + triggerHeight + offset + arrowGap;
    }

    // Horizontal adjustments
    if (finalPlacement === 'right' && left + contentWidth > SCREEN_WIDTH - margin) {
      finalPlacement = 'left';
      left = pageX - contentWidth - offset - arrowGap;
    }
    if (finalPlacement === 'left' && left < margin) {
      finalPlacement = 'right';
      left = pageX + triggerWidth + offset + arrowGap;
    }

    // Clamp within screen
    if (left < margin) left = margin;
    if (left + contentWidth > SCREEN_WIDTH - margin) left = SCREEN_WIDTH - contentWidth - margin;
    if (top < margin) top = margin;
    if (top + contentHeight > SCREEN_HEIGHT - margin) top = SCREEN_HEIGHT - contentHeight - margin;
  }

  setActualPlacement?.(finalPlacement);
  return { top, left };
};
