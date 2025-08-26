import { useColorScheme, vars } from 'nativewind';
import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { GlobalActionSheet, GlobalAlertDialog, PortalHost } from '../components';

interface ThemeProviderProps {
  children: React.ReactNode;
  themes: Record<ThemeType, Record<string, string>>;
}
type ThemeType = 'light' | 'dark';
export const ThemeContext = createContext<{
  theme: ThemeType;
  currentTheme: Record<string, string>;
}>({
  theme: 'light',
  currentTheme: {},
});
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme.currentTheme;
};
export const ThemeProvider = ({ children, themes }: ThemeProviderProps) => {
  const { colorScheme } = useColorScheme();
  const currentTheme = themes[colorScheme!];

  return (
    <ThemeContext.Provider value={{ theme: colorScheme!, currentTheme }}>
      <View style={vars(currentTheme)} className="flex-1">
        <PortalHost />
        <GlobalAlertDialog />
        <GlobalActionSheet.Global />
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
