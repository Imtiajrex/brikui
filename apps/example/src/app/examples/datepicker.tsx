import { useState } from 'react';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

export default function Calendar() {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();

  return (
    <DateTimePicker
      mode="single"
      date={selected}
      onChange={({ date }) => setSelected(date)}
      styles={{
        ...defaultStyles,
        day_label: {
          color: 'white',
        },
      }}
    />
  );
}
