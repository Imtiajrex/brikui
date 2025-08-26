import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Button, Select, MultiSelect, Pressable } from 'brikui';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'React Native', value: 'rn' },
  { label: 'Expo', value: 'expo' },
  { label: 'Next.js', value: 'next' },
  { label: 'Remix', value: 'remix', disabled: true },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
];

export default function SelectExamples() {
  const [controlled, setControlled] = useState<string | undefined>('react');
  const [multiControlled, setMultiControlled] = useState<string[]>(['react', 'expo']);

  return (
    <ScrollView contentContainerClassName="p-4 gap-10" className="flex-1">
      {/* Basic */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Basic</Text>
        <Select options={frameworks} placeholder="Choose framework" />
      </View>

      {/* With Field (label, description, error) */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">With Field</Text>
        <Select
          options={frameworks}
          defaultValue="expo"
          fieldProps={{
            label: 'Framework',
            description: 'Select your primary framework',
          }}
          matchTriggerWidth={false}
          renderTrigger={(props) => (
            <Pressable onPress={props.open} className="p-4 rounded-xl  bg-muted">
              <Text>{props.displayValue || props.placeholder}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Controlled */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Controlled</Text>
        <View className="flex-row gap-2">
          <Button size="sm" onPress={() => setControlled('react')}>
            React
          </Button>
          <Button size="sm" variant="outline" onPress={() => setControlled(undefined)}>
            Clear
          </Button>
        </View>
        <Select
          options={frameworks}
          value={controlled}
          onChange={(v) => setControlled(v)}
          placeholder="Pick one"
          fieldProps={{ label: 'Framework (controlled)' }}
        />
        <Text className="text-xs text-muted-foreground">Value: {controlled ?? 'none'}</Text>
      </View>

      {/* Custom renderOption */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Custom Option</Text>
        <Select
          options={frameworks}
          placeholder="Custom"
          renderOption={(opt, selected) => (
            <View className="flex-row items-center gap-2">
              <View
                className={
                  'w-2.5 h-2.5 rounded-full ' + (selected ? 'bg-success' : 'bg-muted-foreground')
                }
              />
              <Text className={selected ? 'font-semibold' : ''}>{opt.label}</Text>
              {opt.disabled && (
                <Text className="ml-1 text-[10px] text-destructive uppercase">disabled</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Disabled */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Disabled</Text>
        <Select options={frameworks} disabled placeholder="Disabled select" />
      </View>

      {/* Match Trigger Width Off */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">Free Width (matchTriggerWidth = false)</Text>
        <Select
          options={frameworks}
          placeholder="Open me"
          matchTriggerWidth={false}
          popoverContentClassName="w-56"
        />
      </View>

      {/* MultiSelect Basic */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">MultiSelect (basic)</Text>
        <MultiSelect
          options={frameworks}
          placeholder="Choose frameworks"
          defaultValue={['react', 'expo']}
          fieldProps={{ label: 'Frameworks' }}
        />
      </View>

      {/* MultiSelect Controlled */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">MultiSelect (controlled)</Text>
        <View className="flex-row gap-2 flex-wrap">
          <Button size="sm" onPress={() => setMultiControlled(['react'])}>
            React only
          </Button>
          <Button size="sm" onPress={() => setMultiControlled(['react', 'expo', 'next'])}>
            3 items
          </Button>
          <Button size="sm" variant="outline" onPress={() => setMultiControlled([])}>
            Clear
          </Button>
        </View>
        <MultiSelect
          options={frameworks}
          value={multiControlled}
          onChange={(vals: string[]) => setMultiControlled(vals)}
          placeholder="Pick many"
          fieldProps={{ label: 'Frameworks (controlled multi)' }}
        />
        <Text className="text-xs text-muted-foreground">
          Values: {multiControlled.length ? multiControlled.join(', ') : 'none'}
        </Text>
      </View>

      {/* MultiSelect Custom Trigger Label */}
      <View className="gap-3">
        <Text className="text-lg font-semibold">MultiSelect (custom label)</Text>
        <MultiSelect
          options={frameworks}
          defaultValue={['react', 'expo', 'next']}
          placeholder="Frameworks"
          renderMultipleLabel={(labels) =>
            labels.length ? `${labels.length} selected` : 'None selected'
          }
          fieldProps={{ label: 'Frameworks (custom trigger)' }}
        />
      </View>
    </ScrollView>
  );
}
