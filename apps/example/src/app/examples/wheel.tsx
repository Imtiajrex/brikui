import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, WheelPicker, Button } from 'brikui';

export default function WheelExample() {
  const options = ['React', 'Vue', 'Svelte', 'Solid', 'Angular', 'Ember'];
  const [index, setIndex] = useState(0);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic</Text>
        <WheelPicker options={options} value={index} onChange={(i) => setIndex(i)} />
        <Text className="text-sm text-muted-foreground">Selected: {options[index]}</Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Custom Render</Text>
        <WheelPicker
          options={options}
          value={index}
          onChange={(i) => setIndex(i)}
          renderItem={(val, active) => (
            <Text className={active ? 'text-primary font-bold text-base' : 'text-foreground/50'}>
              {val}
            </Text>
          )}
          height={200}
          itemHeight={40}
        />
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Uncontrolled</Text>
        <WheelPicker options={options} defaultValue={2} />
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Programmatic</Text>
        <Button size="sm" onPress={() => setIndex((p) => (p + 1) % options.length)}>
          Next
        </Button>
        <WheelPicker options={options} value={index} onChange={(i) => setIndex(i)} />
      </View>
    </ScrollView>
  );
}
