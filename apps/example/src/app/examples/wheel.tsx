import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, WheelPicker, Button } from 'brikui';

export default function WheelExample() {
  const options = ['React', 'Vue', 'Svelte', 'Solid', 'Angular', 'Ember'];
  const [index, setIndex] = useState(0);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1" nestedScrollEnabled>
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic</Text>
        <WheelPicker
          items={options.map((option) => ({ label: option, value: option }))}
          value={options[index]}
          onValueChange={(value, index) => {
            setIndex(index);
          }}
        />
        <Text className="text-sm text-muted-foreground">Selected: {options[index]}</Text>
      </View>
    </ScrollView>
  );
}
