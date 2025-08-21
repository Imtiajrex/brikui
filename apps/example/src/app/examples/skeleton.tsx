import React from 'react';
import { ScrollView, View } from 'react-native';
import { Skeleton } from 'brikui';

export default function SkeletonExamples() {
  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </View>

      <View className="gap-3">
        <Skeleton className="h-10 w-full" />
        <View className="flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </View>
      </View>

      <View className="gap-4">
        <View className="flex-row gap-4 items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </View>
        </View>
        <View className="gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </View>
      </View>

      <View className="gap-4">
        <View className="flex-row gap-3">
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
        </View>
      </View>
    </ScrollView>
  );
}
