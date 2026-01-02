export function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, delta: number) {
	return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function addDays(date: Date, delta: number) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

export function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function isSameMonth(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function clampYearRange(fromYear: number, toYear: number) {
	const from = Math.min(fromYear, toYear);
	const to = Math.max(fromYear, toYear);
	return { from, to };
}

export function firstDayOfWeekToIndex(
	firstDay: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"
): number {
	switch (firstDay) {
		case "sun":
			return 0;
		case "mon":
			return 1;
		case "tue":
			return 2;
		case "wed":
			return 3;
		case "thu":
			return 4;
		case "fri":
			return 5;
		case "sat":
			return 6;
	}
}

export function getLocaleFirstDayOfWeekIndex(locale?: string): number {
	try {
		// Modern runtimes support Intl.Locale().weekInfo.firstDay (1=Mon ... 7=Sun)
		// RN/web polyfills may not; in that case we fall back to Sunday.
		const IntlAny = Intl as unknown as {
			Locale?: new (tag: string) => { weekInfo?: { firstDay?: number } };
		};
		if (!IntlAny.Locale) return 0;
		const tag = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
		const loc = new IntlAny.Locale(tag);
		const firstDay = loc.weekInfo?.firstDay;
		if (!firstDay) return 0;
		// weekInfo.firstDay: 1=Mon ... 7=Sun
		return firstDay === 7 ? 0 : Math.max(0, Math.min(6, firstDay));
	} catch {
		return 0;
	}
}

export function buildMonthGrid(month: Date, firstDayOfWeekIndex = 0) {
	const first = startOfMonth(month);
	const firstWeekday = first.getDay(); // 0=Sun
	const safeFirst = Math.max(0, Math.min(6, firstDayOfWeekIndex));
	const offset = (firstWeekday - safeFirst + 7) % 7;
	const gridStart = addDays(first, -offset);
	const days: Date[] = [];
	for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
	return Array.from({ length: 6 }, (_, week) =>
		days.slice(week * 7, week * 7 + 7)
	);
}
