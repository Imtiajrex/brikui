import { useMemo } from 'react';

const textClassPrefixSet = [
  'text-',
  'font-',
  'leading-',
  'transition-colors',
  'whitespace-',
  'text-opacity-',
  'font-',
  'tracking-',
  'line-clamp-',
  'text-overflow-',
  'text-decoration-',
  'text-transform-',
  'text-align-',
  'text-justify-',
  'text-indent-',
  'underline',
  'line-through',
  'no-underline',
  'uppercase',
  'lowercase',
  'capitalize',
  'normal-case',
  'truncate',
  'overflow-ellipsis',
  'overflow-clip',
  'overflow-visible',
  'overflow-hidden',
  'overflow-scroll',
  'overflow-auto',
  'antialiased',
  'subpixel-antialiased',
  'italic',
  'not-italic',
  'italic',
  'normal-nums',
  'ordinal',
  'slashed-zero',
  'lining-nums',
  'oldstyle-nums',
  'proportional-nums',
  'tabular-nums',
  'diagonal-fractions',
  'stacked-fractions',
  'normal-nums',
];

export const useExtractTextClasses = (className?: string) => {
  const { textClasses } = useMemo(() => extractTextClasses(className), [className]);
  return textClasses;
};
const extractTextClasses = (className?: string) => {
  if (!className) return { textClasses: '', classes: '' };
  const classes = className.split(' ');
  const textClasses = classes
    .filter((c) => textClassPrefixSet.some((nc) => c.startsWith(nc) || c.includes(nc)))
    .join(' ');
  return { textClasses, classes };
};
