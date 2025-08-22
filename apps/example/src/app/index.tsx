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
  {
    title: 'PinInput',
    description: 'A segmented PIN/OTP input',
  },
  {
    title: 'Slider',
    description: 'A reanimated powered slider',
  },
  {
    title: 'Range-Slider',
    description: 'A sticky range slider',
  },
  {
    title: 'Segmented-Control',
    description: 'A segmented switch between multiple options',
  },
  {
    title: 'Badge',
    description: 'A small count or labeling component',
  },
  {
    title: 'Pagination',
    description: 'Navigate between pages of content',
  },
  {
    title: 'Alert',
    description: 'Provide contextual feedback messages',
  },
  {
    title: 'Skeleton',
    description: 'Show loading placeholder UI',
  },
  {
    title: 'Popover',
    description: 'Contextual floating content',
  },
  {
    title: 'Timeline',
    description: 'Display a sequence of events',
  },
  {
    title: 'Checkbox',
    description: 'A selectable checkbox component',
  },
  {
    title: 'Progress',
    description: 'Visualize task completion',
  },
  {
    title: 'Alert-Dialog',
    description: 'Modal confirmation dialog',
  },
  {
    title: 'Dialog',
    description: 'General purpose modal dialog',
  },
  {
    title: 'Select',
    description: 'Single value dropdown selection',
  },
  {
    title: 'BottomSheet',
    description: 'Slide-up panel for actions/content',
  },
  {
    title: 'ActionSheet',
    description: 'iOS style action list',
  },
];
