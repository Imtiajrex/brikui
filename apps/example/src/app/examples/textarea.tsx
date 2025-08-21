import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Textarea } from 'brikui';

export default function TextareaExamples() {
  const [value, setValue] = useState('');

  return (
    <ScrollView contentContainerClassName="p-4 gap-6" className="flex-1">
      <View className="gap-4">
        <Textarea
          label="Description"
          placeholder="Write something..."
          value={value}
          onChangeText={setValue}
          rows={4}
        />
        <Textarea variant="filled" label="Filled" placeholder="Your message" rows={5} />
        <Textarea
          label="With error"
          error="Please add more details"
          placeholder="Explain here"
          rows={3}
        />
        <Textarea label="Disabled" disabled placeholder="Disabled textarea" rows={3} />
      </View>
    </ScrollView>
  );
}
