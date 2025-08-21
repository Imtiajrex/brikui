import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PasswordInput } from 'brikui';

export default function PasswordInputExamples() {
  const [value, setValue] = useState('');

  return (
    <ScrollView contentContainerClassName="p-4 gap-6" className="flex-1">
      <View className="gap-4">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={value}
          onChangeText={setValue}
          withAsterisk
        />
        <PasswordInput variant="filled" label="Filled" placeholder="Enter password" />
        <PasswordInput
          label="With error"
          error="At least 8 characters"
          placeholder="Enter password"
        />
        <PasswordInput label="Disabled" disabled placeholder="Enter password" />
      </View>
    </ScrollView>
  );
}
