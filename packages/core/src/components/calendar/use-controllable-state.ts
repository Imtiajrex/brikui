import * as React from "react";

type UseControllableStateProps<T> = {
	value: T | undefined;
	defaultValue: T | undefined;
	onChange?: (next: T) => void;
};

export function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: UseControllableStateProps<T>) {
	const isControlled = value !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<T | undefined>(
		defaultValue
	);
	const state = isControlled ? (value as T) : uncontrolled;

	const setState = React.useCallback(
		(next: T) => {
			if (!isControlled) setUncontrolled(next);
			onChange?.(next);
		},
		[isControlled, onChange]
	);

	return [state, setState] as const;
}
