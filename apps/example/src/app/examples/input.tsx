import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Input } from 'brikui';
import { Check } from 'brikui/src/lib/icons/Check';
import { X } from 'brikui/src/lib/icons/X';

export default function InputExamples() {
  const [value, setValue] = useState('');

  const hasValue = value.trim().length > 0;

  return (
    <ScrollView contentContainerClassName="p-4 gap-6" className="flex-1">
      <View className="gap-4">
        <Input label="Default" placeholder="Your name" value={value} onChangeText={setValue} />
        <Input
          variant="filled"
          label="Filled"
          description="Input description"
          placeholder="With left & right sections"
          leftSection={<Check className="text-success" />}
          rightSection={
            hasValue ? <Check className="text-success" /> : <X className="text-muted-foreground" />
          }
        />
        <Input label="Required" withAsterisk placeholder="Input placeholder" />
      </View>

      <View className="gap-4">
        <Input label="With error" error="This field is required" placeholder="Type something" />
        <Input disabled label="Disabled" placeholder="Disabled input" />
      </View>
    </ScrollView>
  );
}
