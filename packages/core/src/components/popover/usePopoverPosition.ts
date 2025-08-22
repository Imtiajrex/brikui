import * as React from 'react';
import type { LayoutRectangle, ScaledSize } from 'react-native';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface UsePopoverPositionParams {
  triggerLayout: LayoutRectangle | null;
  contentSize: { width: number; height: number } | null;
  placement: Placement;
  padding: number;
  screen: ScaledSize;
}

export interface PopoverPositionResult {
  contentPosition: { x: number; y: number };
  resolvedPlacement: Placement;
  setContentSize: React.Dispatch<React.SetStateAction<{ width: number; height: number } | null>>;
}

export function usePopoverPosition({
  triggerLayout,
  contentSize,
  placement,
  padding,
  screen,
}: UsePopoverPositionParams): PopoverPositionResult {
  const [resolvedPlacement, setResolvedPlacement] = React.useState<Placement>(placement);
  const [contentPosition, setContentPosition] = React.useState({ x: 0, y: 0 });
  const [internalContentSize, setContentSize] = React.useState<{
    width: number;
    height: number;
  } | null>(contentSize);

  React.useEffect(() => {
    if (!triggerLayout || !internalContentSize) return;
    const { width: tw, height: th, x: tx, y: ty } = triggerLayout;
    const { width: cw, height: ch } = internalContentSize;

    const placements: Placement[] = [placement, 'bottom', 'top', 'right', 'left'];
    let chosen: Placement = placement;
    let pos = { x: tx, y: ty + th }; // default bottom

    function fits(p: Placement) {
      switch (p) {
        case 'bottom':
          return ty + th + ch + padding <= screen.height;
        case 'top':
          return ty - ch - padding >= 0;
        case 'right':
          return tx + tw + cw + padding <= screen.width;
        case 'left':
          return tx - cw - padding >= 0;
      }
    }

    for (const p of placements) {
      if (fits(p)) {
        chosen = p;
        break;
      }
    }

    switch (chosen) {
      case 'bottom':
        pos = { x: clamp(tx + tw / 2 - cw / 2, padding, screen.width - cw - padding), y: ty + th };
        break;
      case 'top':
        pos = { x: clamp(tx + tw / 2 - cw / 2, padding, screen.width - cw - padding), y: ty - ch };
        break;
      case 'right':
        pos = { x: tx + tw, y: clamp(ty + th / 2 - ch / 2, padding, screen.height - ch - padding) };
        break;
      case 'left':
        pos = { x: tx - cw, y: clamp(ty + th / 2 - ch / 2, padding, screen.height - ch - padding) };
        break;
    }

    setResolvedPlacement(chosen);
    setContentPosition(pos);
  }, [triggerLayout, internalContentSize, placement, padding, screen]);

  return { contentPosition, resolvedPlacement, setContentSize };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}
