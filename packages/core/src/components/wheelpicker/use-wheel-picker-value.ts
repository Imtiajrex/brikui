import * as React from "react";

import type { WheelPickerItem } from "./types";

type UseWheelPickerValueOptions<TValue> = {
	items: Array<WheelPickerItem<TValue>>;
	value?: TValue;
	defaultValue?: TValue;
	onValueChange?: (value: TValue, index: number) => void;
};

function clampIndex(index: number, length: number) {
	if (length <= 0) return 0;
	return Math.max(0, Math.min(length - 1, index));
}

function valueIndexOf<TValue>(
	items: Array<WheelPickerItem<TValue>>,
	value: TValue
) {
	return items.findIndex((i) => Object.is(i.value, value));
}

function useWheelPickerValue<TValue>({
	items,
	value,
	defaultValue,
	onValueChange,
}: UseWheelPickerValueOptions<TValue>) {
	const lastEmittedIndexRef = React.useRef<number | null>(null);
	const isControlled = value !== undefined;

	const initialIndex = React.useMemo(() => {
		if (isControlled) {
			return clampIndex(valueIndexOf(items, value as TValue), items.length);
		}
		if (defaultValue !== undefined) {
			return clampIndex(valueIndexOf(items, defaultValue), items.length);
		}
		return 0;
	}, [defaultValue, isControlled, items, value]);

	const [uncontrolledIndex, setUncontrolledIndex] =
		React.useState(initialIndex);
	const selectedIndex = isControlled
		? clampIndex(valueIndexOf(items, value as TValue), items.length)
		: clampIndex(uncontrolledIndex, items.length);

	const handleIndexChange = React.useCallback(
		(nextIndex: number, userInitiated: boolean) => {
			const clamped = clampIndex(nextIndex, items.length);
			if (lastEmittedIndexRef.current === clamped) return;
			if (!isControlled) setUncontrolledIndex(clamped);
			lastEmittedIndexRef.current = clamped;
			const next = items[clamped];

			if (next && onValueChange) onValueChange(next.value, clamped);
		},
		[isControlled, items, onValueChange]
	);

	return {
		selectedIndex,
		handleIndexChange,
	};
}

export { clampIndex, useWheelPickerValue, valueIndexOf };
export type { UseWheelPickerValueOptions };
