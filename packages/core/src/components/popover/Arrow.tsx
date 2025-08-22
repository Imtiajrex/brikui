import * as React from 'react';
import { memo } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { PopoverPlacement, PopoverPosition } from './types';

export const PopoverArrow = memo(
  ({
    placement,
    size = 8,
    triggerPosition,
    popoverPosition,
    className,
  }: {
    placement: PopoverPlacement;
    size?: number;
    triggerPosition: PopoverPosition;
    popoverPosition: { x: number; y: number };
    className?: string;
  }) => {
    const arrowStyle = useAnimatedStyle(() => {
      let transform = [] as any[];
      let left: number | undefined;
      let top: number | undefined;
      let bottom: number | undefined;
      let right: number | undefined;

      const triggerCenter = {
        x: triggerPosition.x + triggerPosition.width / 2,
        y: triggerPosition.y + triggerPosition.height / 2,
      };

      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          transform = [{ rotate: '45deg' }];
          left = triggerCenter.x - popoverPosition.x - size / 2;
          bottom = -size / 2;
          break;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          transform = [{ rotate: '225deg' }];
          left = triggerCenter.x - popoverPosition.x - size / 2;
          top = -size / 2;
          break;
        case 'left':
        case 'left-start':
        case 'left-end':
          transform = [{ rotate: '135deg' }];
          right = -size / 2;
          top = triggerCenter.y - popoverPosition.y - size / 2;
          break;
        case 'right':
        case 'right-start':
        case 'right-end':
          transform = [{ rotate: '315deg' }];
          left = -size / 2;
          top = triggerCenter.y - popoverPosition.y - size / 2;
          break;
      }

      return {
        position: 'absolute',
        left,
        top,
        right,
        bottom,
        width: size,
        height: size,
        backgroundColor: 'white',
        transform,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      } as any;
    }, [placement, triggerPosition, popoverPosition]);

    return <Animated.View style={arrowStyle} className={className} />;
  }
);

export default PopoverArrow;
