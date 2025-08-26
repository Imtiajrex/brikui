import { type ClassValue, clsx } from 'clsx';

import { cva, type VariantProps } from 'class-variance-authority';
import { type StringToBoolean } from 'class-variance-authority/dist/types';

import { createTailwindMerge, getDefaultConfig } from 'tailwind-merge';
const customTwMerge = createTailwindMerge(() => {
  const config = getDefaultConfig() as any;
  // Add or modify the 'rounded' class group to include your custom classes
  config.classGroups['rounded'] = [
    { rounded: ['full', 'lg', 'md', 'sm', 'xl', '2xl', '3xl', 'none', 'input', 'radius'] },
  ] as any;
  return config;
});

export function mergeClasses(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

export { mergeClasses as cn, cva, type ConfigVariants, type VariantProps };
