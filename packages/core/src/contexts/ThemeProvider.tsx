import { useColorScheme } from 'nativewind';
import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { create as createTw, TailwindFn } from 'twrnc';

interface ThemeProviderProps {
  children: React.ReactNode;
  themes: Record<ThemeType, Record<string, string>>;
}
type ThemeType = 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: ThemeType;
  tw: TailwindFn | null;
}>({
  theme: 'light',
  tw: null,
});
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
    <ThemeContext.Provider value={{ theme: colorScheme!, tw }}>
      <View style={currentTheme} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
