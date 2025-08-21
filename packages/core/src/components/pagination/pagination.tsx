import * as React from 'react';
import { View } from '../base/view';
import { Pressable } from '../base/pressable';
import { Text } from '../base/text';
import { cn } from '../../lib/utils/utils';

type BaseProps = React.ComponentPropsWithoutRef<typeof View>;

export interface PaginationProps extends Omit<BaseProps, 'children'> {
  pageCount: number; // total number of pages (1-based)
  page?: number; // controlled current page (1-based)
  defaultPage?: number; // uncontrolled initial page (1-based)
  onChange?: (page: number) => void; // fires with new page (1-based)
  siblings?: number; // how many sibling pages to show around current
  boundaries?: number; // always visible pages at each boundary
  showPrevNext?: boolean; // show prev/next buttons
  disabled?: boolean; // disable all interaction
  className?: string; // container class
  itemClassName?: string; // page item button (all)
  activeClassName?: string; // active page override
  inactiveClassName?: string; // inactive page override
  ellipsisClassName?: string; // ellipsis text style
  prevLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}

// Utility to create range
const range = (start: number, end: number) => {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
};

// Build pagination display with ellipsis tokens
function usePaginationTokens(
  page: number,
  pageCount: number,
  siblings: number,
  boundaries: number
) {
  return React.useMemo<(number | 'ellipsis')[]>(() => {
    if (pageCount <= 0) return [];
    const totalNumbers = siblings * 2 + 3 + boundaries * 2; // current + siblings + 2*boundaries + 2 ellipsis
    if (totalNumbers >= pageCount) {
      return range(1, pageCount);
    }

    const leftSibling = Math.max(page - siblings, boundaries + 2);
    const rightSibling = Math.min(page + siblings, pageCount - boundaries - 1);

    const showLeftEllipsis = leftSibling > boundaries + 2; // need left ellipsis
    const showRightEllipsis = rightSibling < pageCount - boundaries - 1; // need right ellipsis

    const tokens: (number | 'ellipsis')[] = [];

    // Left boundary pages
    tokens.push(...range(1, boundaries));

    if (showLeftEllipsis) tokens.push('ellipsis');

    // Middle pages
    tokens.push(...range(leftSibling, rightSibling));

    if (showRightEllipsis) tokens.push('ellipsis');

    // Right boundary pages
    tokens.push(...range(pageCount - boundaries + 1, pageCount));

    return tokens;
  }, [page, pageCount, siblings, boundaries]);
}

const Pagination = React.forwardRef<View, PaginationProps>((props, ref) => {
  const {
    pageCount,
    page: controlledPage,
    defaultPage = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    showPrevNext = true,
    disabled = false,
    className,
    itemClassName,
    activeClassName,
    inactiveClassName,
    ellipsisClassName,
    prevLabel = '<',
    nextLabel = '>',
    ...rest
  } = props;

  const [internal, setInternal] = React.useState(defaultPage);
  const page = Math.min(Math.max(controlledPage ?? internal, 1), pageCount);

  React.useEffect(() => {
    // keep internal in range when pageCount changes
    setInternal((p) => Math.min(Math.max(p, 1), pageCount));
  }, [pageCount]);

  const tokens = usePaginationTokens(page, pageCount, siblings, boundaries);

  const setPage = (p: number) => {
    if (disabled) return;
    const capped = Math.min(Math.max(p, 1), pageCount);
    if (controlledPage == null) setInternal(capped);
    if (capped !== page) onChange?.(capped);
  };

  if (pageCount <= 1) return null; // nothing to paginate

  return (
    <View ref={ref} className={cn('flex-row items-center gap-1', className)} {...rest}>
      {showPrevNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          disabled={disabled || page === 1}
          onPress={() => setPage(page - 1)}
          className={cn(
            'px-3 h-9 rounded-md items-center justify-center',
            page === 1 && 'opacity-50',
            inactiveClassName,
            itemClassName
          )}
        >
          {typeof prevLabel === 'string' || typeof prevLabel === 'number' ? (
            <Text>{prevLabel}</Text>
          ) : (
            prevLabel
          )}
        </Pressable>
      )}
      {tokens.map((tok, idx) => {
        if (tok === 'ellipsis')
          return (
            <View
              key={`e-${idx}`}
              className={cn('px-2 h-9 items-center justify-center', ellipsisClassName)}
            >
              <Text className={cn('text-foreground opacity-70')}>…</Text>
            </View>
          );
        const active = tok === page;
        return (
          <Pressable
            key={tok}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Page ${tok}${active ? ', current' : ''}`}
            onPress={() => setPage(tok)}
            disabled={disabled}
            className={cn(
              'px-3 h-9 rounded-md items-center justify-center',
              active
                ? cn('bg-primary', activeClassName)
                : cn('hover:bg-accent active:bg-accent', inactiveClassName),
              itemClassName
            )}
          >
            <Text
              className={cn(active ? 'text-primary-foreground font-medium' : 'text-foreground')}
            >
              {tok}
            </Text>
          </Pressable>
        );
      })}
      {showPrevNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next page"
          disabled={disabled || page === pageCount}
          onPress={() => setPage(page + 1)}
          className={cn(
            'px-3 h-9 rounded-md items-center justify-center',
            page === pageCount && 'opacity-50',
            inactiveClassName,
            itemClassName
          )}
        >
          {typeof nextLabel === 'string' || typeof nextLabel === 'number' ? (
            <Text>{nextLabel}</Text>
          ) : (
            nextLabel
          )}
        </Pressable>
      )}
    </View>
  );
});

Pagination.displayName = 'Pagination';

export { Pagination };
