import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
    <ScrollView
      contentContainerClassName="max-w-2xl mx-auto w-full pb-12 min-h-screen"
      className="w-full flex-1"
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ScrollView>
  );
}
