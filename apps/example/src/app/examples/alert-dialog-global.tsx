import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, AlertDialog } from 'brikui';

export default function GlobalAlertDialogExamples() {
  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="text-lg font-semibold">Global AlertDialog.show()</Text>
        <Button
          onPress={() =>
            AlertDialog.show({
              title: 'Delete account?',
              description: 'This action is permanent. Continue?',
              confirm: {
                text: 'Delete',
                onAction: () => console.log('Deleted!'),
              },
              cancel: {
                text: 'Cancel',
                onAction: () => console.log('Cancelled delete'),
              },
            })
          }
        >
          Show Global Dialog
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            AlertDialog.show({
              title: 'Session expired',
              description: 'Please sign in again to continue.',
              confirm: { text: 'Sign In', onAction: () => console.log('Navigate to sign in') },
              cancel: { text: 'Later' },
              disableBackdropClose: true,
            })
          }
        >
          Show Non-dismissable Dialog
        </Button>
        <Button variant="ghost" onPress={() => AlertDialog.close()}>
          Force Close (if open)
        </Button>
      </View>
    </ScrollView>
  );
}
