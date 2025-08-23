import * as React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { View, Text, TimePickerInput } from 'brikui';
import { Clock } from 'lucide-react-native';
export default function TimePickerInputExamples() {
  const [timeSingle, setTimeSingle] = React.useState<
    { hours: number; minutes: number } | undefined
  >(undefined);
  const [time24, setTime24] = React.useState<{ hours: number; minutes: number }>({
    hours: 14,
    minutes: 45,
  });

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      <View className="gap-3">
        <TimePickerInput
          value={timeSingle}
          onChange={setTimeSingle}
          fieldProps={{ label: '12h Time', description: 'Popover wheel (12h)' }}
          placeholder="Select time"
        />
        <Text className="text-xs text-muted-foreground">
          Value:{' '}
          {timeSingle
            ? `${timeSingle.hours % 12 === 0 ? 12 : timeSingle.hours % 12}:${timeSingle.minutes
                .toString()
                .padStart(2, '0')} ${timeSingle.hours >= 12 ? 'PM' : 'AM'}`
            : 'none'}
        </Text>
      </View>

      <View className="gap-3">
        <TimePickerInput
          format={24}
          value={time24}
          onChange={setTime24}
          fieldProps={{ label: '24h Time', description: 'Controlled 24h mode', variant: 'filled' }}
          placeholder="Select time"
          minuteStep={5}
        />
        <Text className="text-xs text-muted-foreground">
          Value: {time24.hours.toString().padStart(2, '0')}:
          {time24.minutes.toString().padStart(2, '0')}
        </Text>
      </View>

      <View className="gap-3">
        <TimePickerInput
          value={timeSingle}
          onChange={setTimeSingle}
          fieldProps={{ label: 'Disabled AM', description: 'Only PM selectable' }}
          timePickerProps={{ disableAM: true }}
          placeholder="Select time"
          renderTrigger={(props) => (
            <Pressable
              onPress={() => {
                props.open();
              }}
              className="flex flex-row items-center gap-2"
            >
              <View className="text-sm p-3 rounded-xl bg-muted">{props.value?.hours}</View>
              <Clock size={20} color="black" />
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
