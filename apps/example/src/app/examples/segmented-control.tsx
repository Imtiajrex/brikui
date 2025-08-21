import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SegmentedControl } from 'brikui';

export default function SegmentedControlExamples() {
  const [value, setValue] = useState('React');

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="font-semibold">Usage</Text>
        <SegmentedControl data={['React', 'Angular', 'Vue']} />
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Controlled</Text>
        <SegmentedControl
          data={[
            { label: 'React', value: 'react' },
            { label: 'Angular', value: 'ng' },
            { label: 'Vue', value: 'vue' },
            { label: 'Svelte', value: 'svelte' },
          ]}
          value={value}
          onChange={setValue}
        />
        <Text>Value: {value}</Text>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Vertical with borders</Text>
        <SegmentedControl orientation="vertical" withItemBorders data={['One', 'Two', 'Three']} />
      </View>
    </ScrollView>
  );
}
