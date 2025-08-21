import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'brikui';

export default function ButtonExamples() {
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView contentContainerClassName="p-4 gap-6" className="flex-1">
      <View className="gap-3">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="success">Success</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="muted">Muted</Button>
      </View>

      <View className="gap-3">
        <Button size="xs">XS</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">XL</Button>
        <Button size="icon" accessibilityLabel="Icon" />
      </View>

      <View className="gap-3">
        <Button fullWidth>Full width</Button>
        <Button isLoading>Loading</Button>
        <Button
          onPress={async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 1200));
            setLoading(false);
          }}
          isLoading={loading}
        >
          Simulated async
        </Button>
      </View>
    </ScrollView>
  );
}
