import React, { useRef } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, AlertDialog, AlertDialogHandle } from 'brikui';

export default function AlertDialogExamples() {
  const deleteAccountRef = useRef<AlertDialogHandle>(null);
  const confirmActionRef = useRef<AlertDialogHandle>(null);
  const simpleRef = useRef<AlertDialogHandle>(null);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      {/* Basic Alert Dialog */}
      <View className="gap-4">
        <Text className="text-lg font-semibold">Basic Alert Dialog</Text>

        <Button onPress={() => deleteAccountRef.current?.open()}>Delete Account</Button>

        <AlertDialog
          ref={deleteAccountRef}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          confirmText="Delete Account"
          cancelText="Cancel"
          onConfirm={() => console.log('Account deleted!')}
          onCancel={() => console.log('Cancelled')}
        />
      </View>

      {/* Confirmation Dialog */}
      <View className="gap-4">
        <Text className="text-lg font-semibold">Confirmation Dialog</Text>

        <Button variant="outline" onPress={() => confirmActionRef.current?.open()}>
          Confirm Action
        </Button>

        <AlertDialog
          ref={confirmActionRef}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          confirmText="Yes, Continue"
          cancelText="No, Cancel"
          onConfirm={() => console.log('Action confirmed!')}
          onCancel={() => console.log('Action cancelled')}
        />
      </View>

      {/* Simple Dialog */}
      <View className="gap-4">
        <Text className="text-lg font-semibold">Simple Dialog</Text>

        <Button variant="ghost" onPress={() => simpleRef.current?.open()}>
          Show Simple Dialog
        </Button>

        <AlertDialog
          ref={simpleRef}
          title="Simple Dialog"
          description="This is a simple alert dialog with minimal configuration."
          onConfirm={() => console.log('Simple dialog confirmed')}
        />
      </View>
    </ScrollView>
  );
}
