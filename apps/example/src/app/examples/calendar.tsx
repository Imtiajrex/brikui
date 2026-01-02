import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button, Calendar } from 'brikui';
import { RangeCalendar } from 'brikui';

export default function CalendarExamples() {
  const [single, setSingle] = React.useState<any>();
  const [range, setRange] = React.useState<{ startDate?: any; endDate?: any }>({});
  const [multi, setMulti] = React.useState<any[] | undefined>(undefined);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10 flex" className="flex-1">
      <View className="gap-3">
        <Text className="text-lg font-semibold">Single (Controlled)</Text>
        <Calendar />
        <Text className="text-xs text-muted-foreground">
          Value: {single?.toString?.() || 'none'}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Range</Text>
        <RangeCalendar />
        <Text className="text-xs text-muted-foreground">
          Start: {range.startDate?.toString?.() || '—'} | End: {range.endDate?.toString?.() || '—'}
        </Text>
      </View>
    </ScrollView>
  );
}
