import React from 'react';
import { Input, Popover, Pressable, Text, View } from 'brikui';
import { ScrollView } from 'react-native';

const placementsPrimary = ['top', 'bottom', 'left', 'right'] as const;
const Trigger: React.FC<{ label: string; placement: any }> = ({ label, placement }) => (
  <Popover
    placement={placement}
    content={
      <View>
        <Text className="text-xs">Placement: {label}</Text>
      </View>
    }
    onOpen={() => console.log('Opened ->', placement)}
    onClose={() => console.log('Closed ->', placement)}
    matchTriggerWidth
    renderInPortal
  >
    <Pressable className="px-3 py-2 w-full m-1 rounded-lg bg-blue-500/80">
      <Text className="text-white text-xs">{label}</Text>
    </Pressable>
  </Popover>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View className="mb-6">
    <Text className="font-semibold mb-2 text-base">{title}</Text>
    <View className="flex-col gap-2 flex-wrap items-center">{children}</View>
  </View>
);

const MyComponent: React.FC = () => {
  return (
    <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
      <Text className="text-xl font-bold mb-4">Popover Placements</Text>

      <Section title="Primary (top / bottom / left / right)">
        {placementsPrimary.map((p) => (
          <Trigger key={p} label={p} placement={p} />
        ))}
      </Section>
      <Popover
        content={
          <View className="p-4 bg-muted rounded-xl">
            <View className="p-2">Search</View>
          </View>
        }
        renderInPortal
      >
        <Pressable>
          <Input placeholder="Enter your search" />
        </Pressable>
      </Popover>
    </ScrollView>
  );
};
export default MyComponent;
