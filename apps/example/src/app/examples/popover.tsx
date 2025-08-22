import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Pressable, Button, Popover, type PopoverRef } from 'brikui';

export default function PopoverExamples() {
  const controlledRef = useRef<PopoverRef>(null);
  const menuRef = useRef<PopoverRef>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      {/* 1. Basic (shorthand) */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic</Text>
        <Popover placement="left" content={<Text className="text-xs">View profile</Text>}>
          <Pressable className="px-3 py-1 rounded-md bg-muted">
            <Text>@user</Text>
          </Pressable>
        </Popover>
      </View>

      {/* 2. Placements */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Placements</Text>
        <View className="flex-row flex-wrap gap-3">
          {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
            <Popover
              key={p}
              placement={p}
              content={<Text className="text-xs capitalize">Placed {p}</Text>}
            >
              <Pressable className="px-3 py-1 rounded-md bg-accent">
                <Text className="text-accent-foreground">{p}</Text>
              </Pressable>
            </Popover>
          ))}
        </View>
      </View>

      {/* 3. Controlled */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Controlled</Text>
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => setControlledOpen(true)}>
            Open
          </Button>
          <Button size="sm" variant="outline" onPress={() => setControlledOpen(false)}>
            Close
          </Button>
          <Button size="sm" variant="ghost" onPress={() => setControlledOpen((o) => !o)}>
            Toggle
          </Button>
        </View>
        <Popover
          ref={controlledRef}
          isVisible={controlledOpen}
          onVisibilityChange={setControlledOpen}
          content={<Text className="text-xs">I am {controlledOpen ? 'open' : 'closed'}</Text>}
        >
          <Pressable className="px-3 py-1 rounded-md bg-muted">
            <Text>@controlled</Text>
          </Pressable>
        </Popover>
      </View>

      {/* 4. Imperative ref */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Imperative</Text>
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => menuRef.current?.show()}>
            Open
          </Button>
          <Button size="sm" variant="outline" onPress={() => menuRef.current?.hide()}>
            Close
          </Button>
          <Button size="sm" variant="ghost" onPress={() => menuRef.current?.toggle()}>
            Toggle
          </Button>
        </View>
        <Popover
          ref={menuRef}
          placement="bottom"
          content={<Text className="text-xs">Action 1{'\n'}Action 2</Text>}
        >
          <Pressable className="px-4 h-10 rounded-md bg-primary items-center justify-center">
            <Text className="text-primary-foreground">@menu</Text>
          </Pressable>
        </Popover>
      </View>
    </ScrollView>
  );
}
