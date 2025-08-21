import { createContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { create as createTw, TailwindFn } from 'twrnc';
import { create } from 'zustand';

interface ThemeProviderProps {
  children: React.ReactNode;
  themes: Record<ThemeType, any>;
}
type ThemeType = 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: ThemeType;
}>({
  theme: 'light',
});
const currentThemeStore = create<{
  theme: any;
  setTheme: (theme: any) => void;
  tw: TailwindFn | null;
}>((set) => ({
  theme: undefined,
  setTheme: (theme) => set({ theme }),
  tw: null,
}));
export const useTw = () => {
  const { tw } = currentThemeStore.getState();
  return tw;
};
export const ThemeProvider = ({ children, themes }: ThemeProviderProps) => {
  const { colorScheme } = useColorScheme();
  const currentTheme = themes[colorScheme!];

  useEffect(() => {
    currentThemeStore.setState({
      tw: createTw({ theme: { colors: currentTheme }, plugins: [] }),
      theme: currentTheme,
    });
  }, [currentTheme, colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme: colorScheme! }}>
      <View style={currentTheme} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
