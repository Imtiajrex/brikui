import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button, Calendar } from 'brikui';

export default function CalendarExamples() {
  const [single, setSingle] = React.useState<any>();
  const [range, setRange] = React.useState<{ startDate?: any; endDate?: any }>({});
  const [multi, setMulti] = React.useState<any[] | undefined>(undefined);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      <View className="gap-3">
        <Text className="text-lg font-semibold">Single (Controlled)</Text>
        <Calendar
          mode="single"
          value={single}
          onValueChange={({ date }) => setSingle(date)}
          showOutsideDays
        />
        <Text className="text-xs text-muted-foreground">
          Value: {single?.toString?.() || 'none'}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Range</Text>
        <Calendar
          mode="range"
          rangeValue={range}
          onValueChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
          showOutsideDays
        />
        <Text className="text-xs text-muted-foreground">
          Start: {range.startDate?.toString?.() || '—'} | End: {range.endDate?.toString?.() || '—'}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Multiple</Text>
        <Calendar
          mode="multiple"
          values={multi}
          onValueChange={({ dates }) => setMulti(dates)}
          showOutsideDays
        />
        <Text className="text-xs text-muted-foreground">Count: {multi?.length || 0}</Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">With Time Picker</Text>
        <Calendar
          mode="single"
          value={single}
          onValueChange={({ date }) => setSingle(date)}
          timePicker
          showOutsideDays
        />
      </View>
    </ScrollView>
  );
}
