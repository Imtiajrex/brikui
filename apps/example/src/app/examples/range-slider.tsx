import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import { RangeSlider } from 'brikui';

const MIN_AGE = 18;
const MAX_AGE = 60;

export default function RangeSliderExamples() {
  const [min, setMin] = useState(MIN_AGE);
  const [max, setMax] = useState(MAX_AGE);
  const [disableRange, setDisableRange] = useState(false);

  const handleValueChange = useCallback((newLow: number, newHigh: number) => {
    setMin(newLow);
    setMax(newHigh);
  }, []);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="text-lg font-semibold text-center">
          {disableRange ? 'Set your age' : 'Set Age Range'}
        </Text>
        <RangeSlider
          label="Age"
          description="Choose your preferred age range"
          min={MIN_AGE}
          max={MAX_AGE}
          step={1}
          minRange={5}
          low={min}
          high={max}
          onValueChange={handleValueChange}
          disableRange={disableRange}
        />
        <Button
          title={disableRange ? 'Switch to double control' : 'Switch to single control'}
          onPress={() => setDisableRange((p) => !p)}
        />
      </View>
    </ScrollView>
  );
}
