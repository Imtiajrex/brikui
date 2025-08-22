import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, AlertDialog } from 'brikui';

export default function AlertDialogExamples() {
  const [open, setOpen] = useState(false);
  const ref = useRef<{ show: () => void; hide: () => void } | null>(null);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-3">
        <Button onPress={() => setOpen(true)}>Controlled Open</Button>
        <AlertDialog
          isOpen={open}
          setIsOpen={setOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        />
      </View>

      <View className="gap-3">
        <Button onPress={() => ref.current?.show()}>Open via Ref</Button>
        <AlertDialog
          ref={ref as any}
          title="Delete project?"
          description="This cannot be undone."
          confirm={{ text: 'Delete', variant: 'default', onPress: () => {} }}
          cancel={{ text: 'Cancel' }}
        />
      </View>
    </ScrollView>
  );
}
