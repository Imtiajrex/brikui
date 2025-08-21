import { useTheme, useTw } from '../../contexts/ThemeProvider';

export const useColor = (color: string) => {
  const theme = useTheme();
  const localColor =
    color.includes('bg-') || color.includes('text-') || color.includes('border-')
      ? color
      : `text-${color}`;
  const classNameSplit = localColor.split(' ');
  const colorClassName = classNameSplit
    .find((c) => c.startsWith('bg-') || c.startsWith('text-') || c.startsWith('border-'))
    ?.replace(/^bg-/, '')
    .replace(/^text-/, '')
    .replace(/^border-/, '');

  const colorValue = theme[`--color-${colorClassName}`! as keyof typeof theme];
  return colorValue;
};
