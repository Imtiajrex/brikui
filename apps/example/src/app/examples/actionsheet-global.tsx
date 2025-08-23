import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, GlobalActionSheet } from 'brikui';

export default function GlobalActionSheetExamples() {
  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="text-lg font-semibold">Global ActionSheet.show()</Text>
        <Button
          onPress={() =>
            GlobalActionSheet.show({
              title: 'Share',
              description: 'Pick a destination',
              actions: [
                { label: 'Copy Link', onPress: () => console.log('copy') },
                { label: 'Email', onPress: () => console.log('email') },
                { label: 'Delete', destructive: true, onPress: () => console.log('delete') },
              ],
            })
          }
        >
          Show Global Action Sheet
        </Button>
        <Button variant="outline" onPress={() => GlobalActionSheet.hide()}>
          Hide (if open)
        </Button>
      </View>
    </ScrollView>
  );
}
