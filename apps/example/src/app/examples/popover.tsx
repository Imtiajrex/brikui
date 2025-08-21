import React, { useState } from 'react';
import { ScrollView, Image } from 'react-native';
import { Popover, Pressable, Text, usePopable, View } from 'brikui';

export default function PopoverExamples() {
  const [visible, setVisible] = useState(false);
  const [ref, { hide, show }] = usePopable();

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      <View className="gap-4">
        <Text className="font-semibold">Basic</Text>
        <Popover content={<Text className="text-xs">See profile</Text>}>
          <Text>@eveningkid</Text>
        </Popover>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Custom content</Text>
        <Popover
          title="User"
          description="Popover with custom view"
          content={
            <View className="items-center gap-2">
              <Image
                source={{ uri: 'https://placekitten.com/100/100' }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
              <Text className="text-xs">Cute kitten</Text>
            </View>
          }
        >
          <Text>@kitten</Text>
        </Popover>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Hover (web)</Text>
        <Popover action="hover" content="See profile">
          <Text>@hover_me</Text>
        </Popover>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Controlled</Text>
        <Pressable
          onPress={() => setVisible((v) => !v)}
          className="px-4 h-10 rounded-md bg-primary items-center justify-center"
        >
          <Text className="text-primary-foreground">Toggle</Text>
        </Pressable>
        <Popover visible={visible} onAction={(v) => setVisible(v)} content="Controlled content">
          <Text>@controlled</Text>
        </Popover>
      </View>

      <View className="gap-4">
        <Text className="font-semibold">Imperative (usePopable)</Text>
        <Pressable
          onPress={() => show()}
          className="px-4 h-10 rounded-md bg-accent items-center justify-center"
        >
          <Text className="text-accent-foreground">Open Menu</Text>
        </Pressable>
        <Popover ref={ref} content={<Text className="text-xs">Menu item 1{'\n'}Menu item 2</Text>}>
          <Text>@menu</Text>
        </Popover>
        <Pressable
          onPress={() => hide()}
          className="px-3 h-8 rounded-md bg-muted items-center justify-center"
        >
          <Text className="text-xs text-foreground">Hide</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
