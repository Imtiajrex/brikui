import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Timeline, TimelineItem } from 'brikui';

export default function TimelineExamples() {
  return (
    <ScrollView contentContainerClassName="p-4 gap-8" className="flex-1">
      <View className="gap-4">
        <Text className="font-semibold">Usage</Text>
        <Timeline active={1} bulletSize={24} lineWidth={2} className="gap-0">
          <TimelineItem title="New branch">
            <Text className="text-[11px] text-foreground/70">
              You've created new branch fix-notifications branch{'\n'}2 hours ago
            </Text>
          </TimelineItem>
          <TimelineItem title="Commits">
            <Text className="text-[11px] text-foreground/70">
              You've pushed 23 commits to fix-notifications branch{'\n'}52 minutes ago
            </Text>
          </TimelineItem>
          <TimelineItem title="Pull request" lineVariant="dashed">
            <Text className="text-[11px] text-foreground/70">
              You've submitted a pull request Fix incorrect notification message (#187){'\n'}34
              minutes ago
            </Text>
          </TimelineItem>
          <TimelineItem title="Code review">
            <Text className="text-[11px] text-foreground/70">
              Robert Gluesticker left a code review on your pull request{'\n'}12 minutes ago
            </Text>
          </TimelineItem>
        </Timeline>
      </View>
    </ScrollView>
  );
}
