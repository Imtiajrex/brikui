import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { PinInput } from 'brikui';

export default function PinInputExamples() {
  const [value, setValue] = useState('');

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-6 items-center">
        <Text className="font-semibold">Basic</Text>
        <PinInput length={4} value={value} onChange={setValue} placeholder="○" />
        <Text className="text-sm text-muted-foreground">Value: {value}</Text>
      </View>

      <View className="gap-6 items-center">
        <Text className="font-semibold">Masked</Text>
        <PinInput length={6} mask />
      </View>

      <View className="gap-6 items-center">
        <Text className="font-semibold">Sizes</Text>
        <View className="gap-4 items-center">
          <PinInput size="xs" length={5} />
          <PinInput size="sm" length={5} />
          <PinInput size="md" length={5} />
          <PinInput size="lg" length={5} />
          <PinInput size="xl" length={5} />
        </View>
      </View>

      <View className="gap-6 items-center">
        <Text className="font-semibold">Disabled + Error</Text>
        <PinInput length={5} disabled />
        <PinInput length={5} error />
      </View>

      <View className="gap-6 items-center">
        <Text className="font-semibold">Alphanumeric</Text>
        <PinInput type="alphanumeric" length={5} />
      </View>
    </ScrollView>
  );
}
