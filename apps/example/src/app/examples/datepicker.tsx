import { useColorScheme } from 'brikui';
import { useState } from 'react';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

export default function Calendar() {
  const { colorScheme } = useColorScheme();
  const defaultStyles = useDefaultStyles(colorScheme);
  const [selected, setSelected] = useState<DateType>();
  console.log(colorScheme, defaultStyles);

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => setSelected(date)}
      styles={defaultStyles}
      showOutsideDays
      timePicker
    />
  );
}
