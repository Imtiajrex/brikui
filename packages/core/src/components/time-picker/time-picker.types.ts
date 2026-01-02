import type * as React from 'react';
import type { WheelPicker } from '../wheelpicker/wheelpicker';

export type TimeValue = string; // "HH:mm" in 24-hour time

export type TimeParts = {
  hours: number;
  minutes: number;
};

export interface TimePickerProps {
  value?: TimeValue; // controlled "HH:mm" value
  defaultValue?: TimeValue; // uncontrolled initial
  onChange?: (val: TimeValue) => void;
  format?: 12 | 24; // display mode (default 12)
  minuteStep?: number; // minute granularity (default 1)
  disabled?: boolean;
  disabledHours?: number[]; // list of 24h hours to disable (0-23)
  disabledMinutes?: number[]; // list of minutes to disable (0-59)
  disableAM?: boolean;
  disablePM?: boolean;
  hourLabelFormatter?: (h: number, displayHour: number) => string; // h=24h internal, displayHour=12h or 24h shown
  minuteLabelFormatter?: (m: number) => string;
  meridiemLabelFormatter?: (meridiem: 'AM' | 'PM') => string;
  className?: string; // wrapper (excluding Field wrapper)
  wheelClassName?: string; // each wheel wrapper
  wheelWidth?: number; // fixed width for wheel container
  gap?: number; // horizontal gap between wheels (default 12)
  hourWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  minuteWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
  meridiemWheelProps?: Partial<React.ComponentProps<typeof WheelPicker>>;
}
