import { vars } from 'nativewind';

export const themes = {
  light: vars({
    // New token format
    '--color-primary': '#3d13d4',
    '--color-primary-foreground': '#ffffff',
    '--color-secondary': '#c79cff',
    '--color-secondary-foreground': '#222222',
    '--color-background': '#f7f7f7',
    '--color-card': '#fff',
    '--color-card-foreground': '#38383a',
    '--color-foreground': '#38383a',
    '--color-destructive': '#ef4444',
    '--color-muted': '#d4d4d4',
    '--color-muted-foreground': '#222222',
    '--color-destructive-foreground': '#ffffff',
    '--color-success': '#0b8c5d',
    '--color-success-foreground': '#ffffff',
    '--color-accent': '#d2c9f2',
    '--color-accent-foreground': '#1E1E1E',
    '--color-overlay': 'rgba(0, 0, 0, .05)',
  }),
  dark: vars({
    // New token format
    '--color-primary': '#a78bfa',
    '--color-primary-foreground': '#1a1a1a',
    '--color-secondary': '#7c3aed',
    '--color-secondary-foreground': '#ffffff',
    '--color-background': '#1a1a1a',
    '--color-foreground': '#e4e4e7',
    '--color-card': '#fff',
    '--color-card-foreground': '#e4e4e7',
    '--color-destructive': '#f87171',
    '--color-muted': '#404040',
    '--color-muted-foreground': '#d4d4d8',
    '--color-destructive-foreground': '#1a1a1a',
    '--color-success': '#22c55e',
    '--color-success-foreground': '#1a1a1a',
    '--color-accent': '#8b5cf6',
    '--color-accent-foreground': '#f5f5f5',
    '--color-overlay': 'rgba(255, 255, 255, .08)',
  }),
};
