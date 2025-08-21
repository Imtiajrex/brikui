import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Pressable } from 'react-native';
export default function Index() {
  return (
    <ScrollView contentContainerClassName="pt-safe px-4 web:pt-12 pb-24 max-w-2xl mx-auto w-full">
      <Header />
      {components.map((component) => (
        <Pressable
          className="p-4 mb-4 bg-card rounded-lg hover:bg-accent active:bg-accent transition-all"
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

const Header = () => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-center flex-1">BrikUI Components</Text>
    </View>
  );
};

const components = [
  {
    title: 'Button',
    description: 'A button component',
  },
  {
    title: 'Input',
    description: 'A text input component',
  },
  {
    title: 'DatePicker',
    description: 'A date picker component',
  },
  {
    title: 'PasswordInput',
    description: 'A password input component',
  },
  {
    title: 'Textarea',
    description: 'A multi-line text input',
  },
  {
    title: 'Switch',
    description: 'A toggle switch component',
  },
];
