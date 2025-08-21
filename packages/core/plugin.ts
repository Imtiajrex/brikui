import plugin from 'tailwindcss/plugin';
type ColorsType = {
  light: {
    border: string;
    input: string;
    ring: string;
    background: string;
    foreground: string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    success: string;
    'success-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    muted: string;
    'muted-foreground': string;
    accent: string;
    'accent-foreground': string;
    popover: string;
    'popover-foreground': string;
    card: string;
    'card-foreground': string;
  };
  dark: {
    border: string;
    input: string;
    ring: string;
    background: string;
    foreground: string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    success: string;
    'success-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    muted: string;
    'muted-foreground': string;
    accent: string;
    'accent-foreground': string;
    popover: string;
    'popover-foreground': string;
    card: string;
    'card-foreground': string;
  };
};
export default function (Colors: ColorsType) {
  return plugin(
    function ({ addBase }) {
      const lightColors = Object.entries(Colors.light).reduce(
        (acc, [key, value]) => {
          acc[`--${key}`] = value.replace(/rgb\(([^)]+)\)/g, '$1');
          return acc;
        },
        {} as {
          [key: string]: string;
        }
      );
      const darkColors = Object.entries(Colors.dark).reduce(
        (acc, [key, value]) => {
          acc[`--${key}`] = value.replace(/rgb\(([^)]+)\)/g, '$1');
          return acc;
        },
        {} as {
          [key: string]: string;
        }
      );
      addBase({
        ':root': lightColors,
        '.dark': darkColors,
      });
    },
    {
      theme: {
        extend: {
          colors: {
            border: 'rgb(var(--border))',
            input: 'rgb(var(--input))',
            ring: 'rgb(var(--ring))',
            background: 'rgb(var(--background))',
            foreground: 'rgb(var(--foreground))',
            primary: {
              DEFAULT: 'rgb(var(--primary))',
              foreground: 'rgb(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'rgb(var(--secondary))',
              foreground: 'rgb(var(--secondary-foreground))',
            },
            success: {
              DEFAULT: 'rgb(var(--success))',
              foreground: 'rgb(var(--success-foreground))',
            },
            destructive: {
              DEFAULT: 'rgb(var(--destructive))',
              foreground: 'rgb(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'rgb(var(--muted))',
              foreground: 'rgb(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'rgb(var(--accent))',
              foreground: 'rgb(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'rgb(var(--popover))',
              foreground: 'rgb(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'rgb(var(--card))',
              foreground: 'rgb(var(--card-foreground))',
            },
          },
        },
      },
    }
  );
}
