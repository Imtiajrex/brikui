import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Slider } from 'brikui';
import { useSharedValue } from 'react-native-reanimated';

export default function SliderExamples() {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-6">
        <Slider progress={progress} minimumValue={min} maximumValue={max} />
        <Slider progress={progress} minimumValue={min} maximumValue={max} label="Label" />
        <Slider
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          label="Label"
          description="Description"
        />
        <Slider progress={progress} minimumValue={min} maximumValue={max} />
      </View>
    </ScrollView>
  );
}
