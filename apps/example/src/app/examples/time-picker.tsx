import * as React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TimePicker } from 'brikui';

export default function TimePickerExamples() {
  const [time24, setTime24] = React.useState({ hours: 13, minutes: 30 });
  const [time12, setTime12] = React.useState({ hours: 0, minutes: 5 });

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1" nestedScrollEnabled>
      <View className="gap-3">
        <Text className="text-lg font-semibold">24h Controlled</Text>
        <TimePicker
          format={24}
          value={time24}
          onChange={(v) => setTime24(v)}
          fieldProps={{ label: 'Time (24h)' }}
        />
        <Text className="text-xs text-muted-foreground">
          Value: {time24.hours}:{time24.minutes.toString().padStart(2, '0')}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">12h Controlled</Text>
        <TimePicker
          format={12}
          value={time12}
          onChange={(v) => setTime12(v)}
          fieldProps={{ label: 'Time (12h)' }}
        />
        <Text className="text-xs text-muted-foreground">
          Value: {time12.hours % 12 === 0 ? 12 : time12.hours % 12}:
          {time12.minutes.toString().padStart(2, '0')} {time12.hours >= 12 ? 'PM' : 'AM'}
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Minute Step & Disabled</Text>
        <TimePicker
          format={12}
          minuteStep={5}
          disabledMinutes={[15, 20, 25]}
          disabledHours={[0, 1, 2, 3, 4]}
          fieldProps={{ label: '5-min increments', description: 'Early hours disabled' }}
        />
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold">Disable AM</Text>
        <TimePicker
          format={12}
          disableAM
          defaultValue={{ hours: 15, minutes: 0 }}
          fieldProps={{ label: 'PM Only' }}
        />
      </View>
    </ScrollView>
  );
}
