import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TimePicker } from 'brikui';

export default function TimePickerExamples() {
  const [time24, setTime24] = React.useState({ hours: 13, minutes: 30 });
  const [time12, setTime12] = React.useState({ hours: 0, minutes: 5 });

  return (
    <ScrollView contentContainerClassName="p-4 gap-10 flex" className="flex-1" nestedScrollEnabled>
      <View className="gap-3">
        <Text className="text-lg font-semibold">24h Controlled</Text>
        <TimePicker format={24} value={time24} onChange={(v) => setTime24(v)} />
        <Text className="text-xs text-muted-foreground">
          Value: {time24.hours}:{time24.minutes.toString().padStart(2, '0')}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">12h Controlled</Text>
        <TimePicker format={12} value={time12} onChange={setTime12} />
        <Text className="text-xs text-muted-foreground">
          Value: {time12.hours % 12 === 0 ? 12 : time12.hours % 12}:
          {time12.minutes.toString().padStart(2, '0')} {time12.hours >= 12 ? 'PM' : 'AM'}
        </Text>
      </View>
    </ScrollView>
  );
}
