import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Switch } from 'brikui';

export default function SwitchExamples() {
  const [isOn, setIsOn] = useState(true);

  return (
    <ScrollView contentContainerClassName="p-4 gap-6" className="flex-1">
      <View className="gap-4 items-center">
        <Switch size="xs" onCheckedChange={setIsOn} checked={isOn} />
        <Switch size="sm" />
        <Switch size="md" />
        <Switch size="lg" />
        <Switch size="xl" />
      </View>

      <View className="gap-4 items-start w-full">
        <Switch size="md" onLabel="ON" offLabel="OFF" label="Toggle this to ensure toggling!" />
      </View>
    </ScrollView>
  );
}
