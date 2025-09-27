import type { Config } from 'tailwindcss';
const { hairlineWidth } = require('nativewind/theme');
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/core/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary),  <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground),  <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary),  <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground),  <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive),  <alpha-value>)',
          foreground: 'rgb(var(--color-destructive-foreground),  <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success),  <alpha-value>)',
          foreground: 'rgb(var(--color-success-foreground),  <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent),  <alpha-value>)',
          foreground: 'rgb(var(--color-accent-foreground),  <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted),  <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground),  <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--color-card),  <alpha-value>)',
          foreground: 'rgb(var(--color-card-foreground),  <alpha-value>)',
        },
        overlay: 'var(--color-overlay)',
        background: 'rgb(var(--color-background),  <alpha-value>)',
        foreground: 'rgb(var(--color-foreground),  <alpha-value>)',
        border: 'rgb(var(--color-border),  <alpha-value>)',
        input: 'rgb(var(--color-border-input),  <alpha-value>)',
        ring: 'rgb(var(--color-ring),  <alpha-value>)',
      },
      borderRadius: {
        radius: 'var(--radius)',
        input: 'var(--input-radius)',
        popover: 'var(--popover-radius)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      fontSize: {
        '3xl': '2.25rem',
        '4xl': '2.75rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
