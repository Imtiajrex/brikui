import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Progress, Button } from 'brikui';

export default function ProgressExamples() {
  const [value, setValue] = useState(25);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Progress
          label="Uploading"
          description="Primary progress with value"
          value={value}
          showValueLabel
        />
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => setValue((v) => Math.max(0, v - 10))}>
            -10%
          </Button>
          <Button size="sm" onPress={() => setValue((v) => Math.min(100, v + 10))}>
            +10%
          </Button>
          <Button size="sm" onPress={() => setValue(0)}>
            Reset
          </Button>
        </View>
      </View>

      <View className="gap-4">
        <Progress label="Accent" color="accent" value={55} showValueLabel />
        <Progress label="Success" color="success" value={70} showValueLabel />
        <Progress label="Destructive" color="destructive" value={35} showValueLabel />
      </View>

      <View className="gap-4">
        <Progress label="Striped" striped value={60} showValueLabel />
      </View>

      <View className="gap-4">
        <Progress label="Sizes" size="xs" value={40} />
        <Progress size="sm" value={50} />
        <Progress size="md" value={60} />
        <Progress size="lg" value={70} />
      </View>
    </ScrollView>
  );
}
