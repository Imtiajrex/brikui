import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TimePicker, parseTimeValue } from 'brikui';

export default function TimePickerExamples() {
  const [time24, setTime24] = React.useState('13:30');
  const [time12, setTime12] = React.useState('00:05');
  const parsed24 = parseTimeValue(time24);
  const parsed12 = parseTimeValue(time12);
  const meridiem12 = parsed12.hours >= 12 ? 'PM' : 'AM';
  const displayHour12 = parsed12.hours % 12 === 0 ? 12 : parsed12.hours % 12;

  return (
    <ScrollView contentContainerClassName="p-4 gap-10 flex" className="flex-1" nestedScrollEnabled>
      <View className="gap-3">
        <Text className="text-lg font-semibold">24h Controlled</Text>
        <TimePicker format={24} value={time24} onChange={setTime24} />
        <Text className="text-xs text-muted-foreground">
          Value: {parsed24.hours.toString().padStart(2, '0')}:
          {parsed24.minutes.toString().padStart(2, '0')}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">12h Controlled</Text>
        <TimePicker format={12} value={time12} onChange={setTime12} />
        <Text className="text-xs text-muted-foreground">
          Value: {displayHour12}:{parsed12.minutes.toString().padStart(2, '0')} {meridiem12}
        </Text>
      </View>
    </ScrollView>
  );
}
