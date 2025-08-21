import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Badge } from 'brikui';

export default function BadgeExamples() {
  return (
    <ScrollView contentContainerClassName="pt-safe px-4 web:pt-12 pb-24 gap-6">
      <Text className="text-lg font-semibold">Badge Variants</Text>
      <View className="flex-row flex-wrap gap-3 items-center">
        <Badge variant="default">DEFAULT</Badge>
        <Badge variant="filled">FILLED</Badge>
        <Badge variant="light">LIGHT</Badge>
        <Badge variant="outline">OUTLINE</Badge>
        <Badge variant="transparent">TRANSPARENT</Badge>
        <Badge variant="dot">BADGE</Badge>
      </View>

      <Text className="text-lg font-semibold">Sizes</Text>
      <View className="flex-row flex-wrap gap-3 items-center">
        <Badge size="xs">XS</Badge>
        <Badge size="sm">SMALL</Badge>
        <Badge size="md">MEDIUM</Badge>
        <Badge size="lg">LARGE</Badge>
      </View>

      <Text className="text-lg font-semibold">Radius</Text>
      <View className="flex-row flex-wrap gap-3 items-center">
        <Badge radius="sm">SM</Badge>
        <Badge radius="md">MD</Badge>
        <Badge radius="lg">LG</Badge>
        <Badge radius="full">FULL</Badge>
      </View>

      <Text className="text-lg font-semibold">Custom Content</Text>
      <View className="flex-row flex-wrap gap-3 items-center">
        <Badge leftSection={<View className="size-2 rounded-full bg-success" />}>ONLINE</Badge>
        <Badge variant="outline" rightSection={<Text className="text-xs ml-1">12</Text>}>
          NOTIFICATIONS
        </Badge>
      </View>
    </ScrollView>
  );
}
