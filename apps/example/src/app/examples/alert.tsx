import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Alert } from 'brikui';
import { Check } from 'brikui/src/lib/icons/Check';
import { X } from 'brikui/src/lib/icons/X';

export default function AlertExamples() {
  const [visible, setVisible] = useState(true);

  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="font-semibold">Light variant</Text>
        <Alert title="Primary alert" color="primary">
          Simple informational alert
        </Alert>
        <Alert title="Accent alert" color="accent" icon={<Check className="h-4 w-4 text-accent" />}>
          Accent colored alert with icon
        </Alert>
        <Alert
          title="Success alert"
          color="success"
          icon={<Check className="h-4 w-4 text-success" />}
        >
          Operation completed successfully.
        </Alert>
        <Alert
          title="Destructive alert"
          color="destructive"
          icon={<X className="h-4 w-4 text-destructive" />}
        >
          Something went wrong, please retry.
        </Alert>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Filled variant</Text>
        <Alert variant="filled" color="primary" title="Filled primary">
          Primary emphasis
        </Alert>
        <Alert
          variant="filled"
          color="accent"
          title="Filled accent"
          icon={<Check className="h-4 w-4 text-primary-foreground" />}
        >
          Accent filled with icon
        </Alert>
        <Alert
          variant="filled"
          color="success"
          title="Success"
          icon={<Check className="h-4 w-4 text-primary-foreground" />}
        >
          Success with filled style
        </Alert>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">With close button</Text>
        {visible ? (
          <Alert
            title="Dismissible"
            color="secondary"
            withCloseButton
            onClose={() => setVisible(false)}
            icon={<Check className="h-4 w-4 text-secondary" />}
          >
            Tap the close button to hide this alert.
          </Alert>
        ) : (
          <Text className="text-xs text-foreground/60">(Alert dismissed)</Text>
        )}
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Custom radius</Text>
        <Alert title="Rounded" color="accent" radius={24}>
          24px radius example.
        </Alert>
      </View>
    </ScrollView>
  );
}
