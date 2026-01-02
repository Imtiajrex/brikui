import { useUniwind, Uniwind } from 'uniwind';

export function useColorScheme() {
  const { theme } = useUniwind();
  return {
    colorScheme: theme,
    isDarkColorScheme: theme === 'dark',
    setColorScheme: (scheme: 'light' | 'dark' | 'system') => {
      Uniwind.setTheme(scheme);
    },
    toggleColorScheme: () => {
      const newScheme = theme === 'dark' ? 'light' : 'dark';
      Uniwind.setTheme(newScheme);
    },
  };
}
