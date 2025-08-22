import { themes } from '@/constants/theme';
import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider, useColor, useColorScheme } from 'brikui';
import { Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import '../components/gesture-handler';
import '../global.css';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
// 'Warning: You are setting the style `{ shadowOffset: ... }` as a prop. You should nest it in a style object. E.g. `{ style: { shadowOffset: ... } }`',
// create regex to match the warning
// LogBox.ignoreLogs([
//   /You are setting the style `{ shadowOffset: ... }` as a prop. You should nest it in a style object. E.g. `{ style: { shadowOffset: ... } }`/,
// ]);

LogBox.install();
LogBox.ignoreLogs([
  /'You are setting the style `{ shadowOffset: ... }` as a prop. You should nest it in a style object. E.g. `{ style: { shadowOffset: ... } }`/,
]);
export default function Layout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider themes={themes}>
        <Root />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
const Root = () => {
  useEffect(() => {
    colorScheme.set('light');
  }, []);
  return (
    <View className="light flex-1 bg-background">
      <NavigationThemeProvider
        value={{
          ...DefaultTheme,
          colors: {
            background: useColor('background'),
            border: useColor('border'),
            card: useColor('card'),
            primary: useColor('primary'),
            text: useColor('foreground'),
            notification: useColor('foreground'),
          },
          dark: useColorScheme().colorScheme === 'dark',
        }}
      >
        <Stack />
      </NavigationThemeProvider>
    </View>
  );
};
