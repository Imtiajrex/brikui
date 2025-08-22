import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button, BottomSheet } from 'brikui';
import type { BottomSheet as BottomSheetRef } from 'brikui';

export default function BottomSheetExamples() {
  const sheetRef = useRef<BottomSheetRef>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      {/* Basic (imperative) */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic (Imperative)</Text>
        <Button onPress={() => sheetRef.current?.show()}>Open Sheet</Button>
        <BottomSheet ref={sheetRef} title="Basic Sheet">
          <Text className="text-sm text-muted-foreground">This sheet is opened imperatively.</Text>
          <Button
            size="sm"
            onPress={() => sheetRef.current?.hide()}
            className="mt-3"
            variant="outline"
          >
            Close
          </Button>
        </BottomSheet>
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
        <BottomSheet
          open={controlledOpen}
          onOpenChange={(o) => setControlledOpen(o)}
          title="Controlled Sheet"
        >
          <Text className="text-sm">
            State lives in parent: {controlledOpen ? 'open' : 'closed'}
          </Text>
        </BottomSheet>
      </View>

      {/* Custom Content */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Custom Content</Text>
        <BottomSheet ref={sheetRef} title="Reuse Ref" contentClassName="gap-3">
          <Text>Same ref can be reused; content can include any components.</Text>
        </BottomSheet>
      </View>
    </ScrollView>
  );
}
