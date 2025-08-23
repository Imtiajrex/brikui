import React, { useMemo } from 'react';
import { View } from 'react-native';
import { PlacementType, ContentLayout } from './types';

interface ArrowProps {
  placement: PlacementType;
  size: number;
  color: string;
  contentLayout: ContentLayout | null;
}

export const Arrow: React.FC<ArrowProps> = ({ placement, size, color, contentLayout }) => {
  const style = useMemo(() => {
    if (!contentLayout) return { display: 'none' } as any;
    const half = size / 2;
    const base = {
      position: 'absolute' as const,
      width: size,
      height: size,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }],
      borderRadius: 2,
    };
    switch (placement) {
      case 'top':
        return { ...base, bottom: -half, left: contentLayout.width / 2 - half };
      case 'bottom':
        return { ...base, top: -half, left: contentLayout.width / 2 - half };
      case 'left':
        return { ...base, right: -half, top: contentLayout.height / 2 - half };
      case 'right':
        return { ...base, left: -half, top: contentLayout.height / 2 - half };
      default:
        return base;
    }
  }, [placement, size, color, contentLayout]);
  return <View pointerEvents="none" style={style} />;
};
