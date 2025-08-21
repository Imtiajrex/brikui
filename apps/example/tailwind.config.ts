import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/core/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary-default)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary-default)',
          light: 'var(--color-secondary-light)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary-default)',
          light: 'var(--color-tertiary-light)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-default)',
          light: 'var(--color-accent-light)',
        },
        grey: {
          DEFAULT: 'var(--color-grey-default)',
        },
        slate: {
          DEFAULT: 'var(--color-slate-default)',
        },
        dark: {
          DEFAULT: 'var(--color-dark-default)',
        },
        light: {
          DEFAULT: 'var(--color-light-default)',
        },
        overlay: 'var(--color-overlay)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
