import * as React from 'react';
import { Text as RNText } from '../../components/base/text';
import { cn } from './utils';

// Renders primitive values (string/number) as Text while passing through React elements.
// Optional className applied only when we wrap primitives.
export function renderNode(node: React.ReactNode, className?: string): React.ReactNode {
  if (node == null || typeof node === 'boolean') return null;
  if (typeof node === 'string' || typeof node === 'number') {
    return <RNText className={cn('leading-none', className)}>{node}</RNText>;
  }

  // check if fragment
  if (React.isValidElement(node) && node.type === React.Fragment) {
    return React.Children.map((node.props as any)?.children, (child, i) => (
      <React.Fragment key={i}>{renderNode(child, className)}</React.Fragment>
    ));
  }
  if (Array.isArray(node)) {
    return node.map((n, i) => <React.Fragment key={i}>{renderNode(n, className)}</React.Fragment>);
  }
  return node;
}
