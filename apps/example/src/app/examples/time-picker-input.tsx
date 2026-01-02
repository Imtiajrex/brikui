import * as React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { View, Text, TimePickerInput, parseTimeValue } from 'brikui';
import { Clock } from 'lucide-react-native';
export default function TimePickerInputExamples() {
  const [timeSingle, setTimeSingle] = React.useState<string | undefined>(undefined);
  const [time24, setTime24] = React.useState<string>('14:45');
  const parsedSingle = timeSingle ? parseTimeValue(timeSingle) : undefined;
  const parsed24 = parseTimeValue(time24);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10 flex" className="flex-1">
      <View className="gap-3">
        <TimePickerInput
          value={timeSingle}
          onChange={setTimeSingle}
          fieldProps={{ label: '12h Time', description: 'Popover wheel (12h)' }}
          placeholder="Select time"
        />
        <Text className="text-xs text-muted-foreground">
          Value:{' '}
          {parsedSingle
            ? (() => {
                const meridiem = parsedSingle.hours >= 12 ? 'PM' : 'AM';
                const displayHour = parsedSingle.hours % 12 === 0 ? 12 : parsedSingle.hours % 12;
                return `${displayHour}:${parsedSingle.minutes
                  .toString()
                  .padStart(2, '0')} ${meridiem}`;
              })()
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
          Value: {parsed24.hours.toString().padStart(2, '0')}:
          {parsed24.minutes.toString().padStart(2, '0')}
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
              <View className="text-sm p-3 rounded-xl bg-muted">
                {props.value ? parseTimeValue(props.value).hours : '--'}
              </View>
              <Clock size={20} color="black" />
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
