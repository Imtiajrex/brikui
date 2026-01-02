export type Item<T extends number> = { label: string; value: T };

export type FirstDayOfWeek =
	| "sun"
	| "mon"
	| "tue"
	| "wed"
	| "thu"
	| "fri"
	| "sat";

export type PageBehavior = "paged" | "single";

export type CalendarProps = {
	value?: Date;
	defaultValue?: Date;
	onValueChange?: (date: Date | undefined) => void;
	month?: Date;
	defaultMonth?: Date;
	onMonthChange?: (month: Date) => void;
	fromYear?: number;
	toYear?: number;
	visibleMonths?: 1 | 2 | 3;
	firstDayOfWeek?: FirstDayOfWeek;
	pageBehavior?: PageBehavior;
	disabled?: (date: Date) => boolean;
	isDateUnavailable?: (date: Date) => boolean;
	className?: string;
	monthYearPickerContainerClassName?: string;
};
