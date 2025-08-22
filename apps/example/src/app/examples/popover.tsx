import React, { useRef } from 'react';
import { Popover, PopoverRef, Pressable, Text, View } from 'brikui';
import { TouchableOpacity } from 'react-native';

const MyComponent: React.FC = () => {
  return (
    <View className="flex-1 p-4">
      <Popover
        placement="bottom"
        content={
          <View>
            <Text>Content</Text>
          </View>
        }
        onOpen={() => console.log('Opened')}
        onClose={() => console.log('Closed')}
      >
        <Pressable className="h-3 p-4 rounded-xl bg-red-300 w-24">
          <Text>Trigger</Text>
        </Pressable>
      </Popover>
    </View>
  );
};
export default MyComponent;
