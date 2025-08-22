import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button, ActionSheet } from 'brikui';
import type { ActionSheetHandle } from 'brikui';

export default function ActionSheetExamples() {
  const sheetRef = useRef<ActionSheetHandle>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      {/* Imperative */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Imperative</Text>
        <Button onPress={() => sheetRef.current?.show()}>Open Action Sheet</Button>
        <ActionSheet
          ref={sheetRef}
          title="Share"
          description="Choose a destination"
          actions={[
            { label: 'Copy Link', onPress: () => console.log('copy') },
            { label: 'Share via Email', onPress: () => console.log('email') },
            { label: 'Delete', destructive: true, onPress: () => console.log('delete') },
          ]}
        />
      </View>

      {/* Controlled */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Controlled</Text>
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => setControlledOpen(true)}>
            Open
          </Button>
          <Button size="sm" variant="outline" onPress={() => setControlledOpen(false)}>
            Close
          </Button>
        </View>
        <ActionSheet
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          title="Options"
          actions={[
            { label: 'Option A', onPress: () => console.log('A') },
            { label: 'Option B', onPress: () => console.log('B') },
            { label: 'Disabled', disabled: true },
          ]}
        />
      </View>

      {/* Custom styling */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Custom Styling</Text>
        <ActionSheet
          title="Styled"
          description="Custom classes applied"
          actions={[{ label: 'One' }, { label: 'Two' }, { label: 'Danger', destructive: true }]}
          contentClassName="p-0"
          actionClassName="bg-transparent"
          cancelClassName="bg-accent"
        />
        <Text className="text-xs text-muted-foreground">
          This sheet is always mounted; trigger via code.
        </Text>
      </View>
    </ScrollView>
  );
}
