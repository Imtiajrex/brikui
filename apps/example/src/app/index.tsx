import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
export default function Index() {
  return (
    <ScrollView contentContainerClassName="pt-safe web:pt-12 pb-24 max-w-2xl mx-auto w-full">
      {components.map((component) => (
        <Pressable
          className="p-4 mb-4 bg-gray-100 rounded-lg"
          key={component.title}
          onPress={() => {
            router.push(`/examples/${component.title.toLowerCase()}`);
          }}
        >
          <Text className="text-lg font-semibold">{component.title}</Text>
          <Text className="text-gray-600">{component.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const components = [
  {
    title: 'Button',
    description: 'A button component',
  },
];
