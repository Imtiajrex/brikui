import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, DatePicker } from 'brikui';

export default function DatePickerFieldExamples() {
  const [single, setSingle] = React.useState<any>();
  const [range, setRange] = React.useState<{ startDate?: any; endDate?: any }>({});
  const [multi, setMulti] = React.useState<any[] | undefined>(undefined);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      <View className="gap-3">
        <DatePicker
          mode="single"
          value={single}
          onChange={({ date }) => setSingle(date)}
          fieldProps={{ label: 'Single', description: 'Single date picker' }}
          placeholder="Select date"
        />
        <Text className="text-xs text-muted-foreground">
          Value: {single?.toString?.() || 'none'}
        </Text>
      </View>

      <View className="gap-3">
        <DatePicker
          mode="range"
          rangeValue={range}
          onChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
          fieldProps={{ label: 'Range', description: 'Range date picker' }}
          placeholder="Select range"
        />
        <Text className="text-xs text-muted-foreground">
          Start: {range.startDate?.toString?.() || '—'} | End: {range.endDate?.toString?.() || '—'}
        </Text>
      </View>

      <View className="gap-3">
        <DatePicker
          mode="multiple"
          values={multi}
          onChange={({ dates }) => setMulti(dates)}
          fieldProps={{ label: 'Multiple', description: 'Multiple dates picker' }}
          placeholder="Select dates"
        />
        <Text className="text-xs text-muted-foreground">Count: {multi?.length || 0}</Text>
      </View>
    </ScrollView>
  );
}
