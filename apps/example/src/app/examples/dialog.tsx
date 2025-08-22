import React, { useRef } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, Dialog, Input } from 'brikui';

export default function DialogExamples() {
  const basicRef = useRef<{ open: () => void; close: () => void }>(null);
  const formRef = useRef<{ open: () => void; close: () => void }>(null);
  const customRef = useRef<{ open: () => void; close: () => void }>(null);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      {/* Basic Dialog */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic Dialog</Text>
        <Button onPress={() => basicRef.current?.open()}>Edit Profile</Button>
        <Dialog
          ref={basicRef}
          title="Edit profile"
          description="Make changes to your profile here. Click save when you're done."
          primaryActionText="Save changes"
          onPrimaryAction={() => console.log('Saved')}
        />
      </View>

      {/* Dialog with Form Content */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Dialog With Form</Text>
        <Button variant="outline" onPress={() => formRef.current?.open()}>
          Open Form Dialog
        </Button>
        <Dialog
          ref={formRef}
          title="Update details"
          description="Change your account details below."
          primaryActionText="Update"
          onPrimaryAction={() => console.log('Form Submitted')}
        >
          <View className="gap-4 w-full">
            <View className="gap-2">
              <Text className="text-sm font-medium">Name</Text>
              <Input placeholder="John Doe" />
            </View>
            <View className="gap-2">
              <Text className="text-sm font-medium">Username</Text>
              <Input placeholder="@johndoe" />
            </View>
          </View>
        </Dialog>
      </View>

      {/* Custom Header & Footer */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Custom Header & Footer</Text>
        <Button variant="ghost" onPress={() => customRef.current?.open()}>
          Custom Dialog
        </Button>
        <Dialog
          ref={customRef}
          header={
            <View className="gap-1">
              <Text className="text-xl font-bold">Billing Plan</Text>
              <Text className="text-sm text-muted-foreground">Select the plan that fits you</Text>
            </View>
          }
          footer={
            <View className="flex flex-row justify-between items-center pt-2">
              <Button variant="outline" onPress={() => customRef.current?.close()}>
                Close
              </Button>
              <Button
                onPress={() => {
                  console.log('Upgraded');
                  customRef.current?.close();
                }}
              >
                Upgrade
              </Button>
            </View>
          }
          showClose
        >
          <View className="gap-3 w-full">
            <View className="p-3 rounded-md border border-border">
              <Text className="font-medium">Free</Text>
              <Text className="text-xs text-muted-foreground">Basic features</Text>
            </View>
            <View className="p-3 rounded-md border border-border bg-accent">
              <Text className="font-medium">Pro</Text>
              <Text className="text-xs text-muted-foreground">Everything you need</Text>
            </View>
          </View>
        </Dialog>
      </View>
    </ScrollView>
  );
}
