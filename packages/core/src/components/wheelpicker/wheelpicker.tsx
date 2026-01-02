import * as React from "react";
import { Platform } from "react-native";

import { WheelPickerList } from "./wheel-picker-list";
import { useWheelPickerValue } from "./use-wheel-picker-value";
import type { WheelPickerItem } from "./types";

type WheelPickerProps<TValue> = {
	items: Array<WheelPickerItem<TValue>>;
	value?: TValue;
	defaultValue?: TValue;
	onValueChange?: (value: TValue, index: number) => void;
	itemHeight?: number;
	visibleItems?: number;
	/** Enable iOS-style selection ticks while scrolling (uses expo-haptics when available). */
	hapticFeedback?: boolean;
	className?: string;
	overlayBgColorClassName?: string;
};

function WheelPicker<TValue>({
	items,
	value,
	defaultValue,
	onValueChange,
	itemHeight = 44,
	visibleItems = 5,
	hapticFeedback = Platform.OS === "ios",
	className,
	overlayBgColorClassName,
}: WheelPickerProps<TValue>) {
	const { selectedIndex, handleIndexChange } = useWheelPickerValue({
		items,
		value,
		defaultValue,
		onValueChange,
	});
	return (
		<WheelPickerList
			items={items}
			selectedIndex={selectedIndex}
			onIndexChange={handleIndexChange}
			itemHeight={itemHeight}
			visibleItems={visibleItems}
			hapticFeedback={hapticFeedback}
			className={className}
			overlayBgColorClassName={overlayBgColorClassName}
		/>
	);
}

export { WheelPicker };
export type { WheelPickerItem, WheelPickerProps };
