import { useColorScheme, vars } from 'nativewind';
import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { create as createTw, TailwindFn } from 'twrnc';
import { PortalHost } from '../components';

interface ThemeProviderProps {
  children: React.ReactNode;
  themes: Record<ThemeType, Record<string, string>>;
}
type ThemeType = 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: ThemeType;
  currentTheme: Record<string, string>;
  tw: TailwindFn | null;
}>({
  theme: 'light',
  currentTheme: {},
  tw: null,
});
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme.currentTheme;
};
export const useTw = () => {
  const theme = useContext(ThemeContext);
  return theme.tw;
};
export const ThemeProvider = ({ children, themes }: ThemeProviderProps) => {
  const { colorScheme } = useColorScheme();
  const currentTheme = themes[colorScheme!];

  const tw = useMemo(() => {
    const colors = Object.fromEntries(
      Object.entries(currentTheme).map(([key, value]) => [key.replace('--color-', ''), value])
    );
    return createTw({
      theme: { colors: colors },
      plugins: [],
    });
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme: colorScheme!, tw, currentTheme }}>
      <View style={vars(currentTheme)} className="flex-1">
        {children}
        <PortalHost />
      </View>
    </ThemeContext.Provider>
  );
};
