import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { cn } from '../lib/utils/utils';

const duration = 1000;

const AnimatedView = withUniwind(Animated.View);
function Skeleton({
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof AnimatedView>, 'style'>) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <AnimatedView
      style={style}
      className={cn('rounded-md bg-muted dark:bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
