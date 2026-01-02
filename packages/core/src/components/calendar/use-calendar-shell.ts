import * as React from 'react';

import { MONTHS } from './constants';
import {
  addMonths,
  clampYearRange,
  firstDayOfWeekToIndex,
  getLocaleFirstDayOfWeekIndex,
  startOfMonth,
} from './date-utils';
import { useControllableState } from './use-controllable-state';
import type { FirstDayOfWeek, Item, PageBehavior } from './types';

export type UseCalendarShellOptions = {
  initialMonth: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  fromYear?: number;
  toYear?: number;
  visibleMonths?: 1 | 2 | 3;
  firstDayOfWeek?: FirstDayOfWeek;
  pageBehavior?: PageBehavior;
};

export function useCalendarShell({
  initialMonth,
  month,
  onMonthChange,
  fromYear,
  toYear,
  visibleMonths,
  firstDayOfWeek,
  pageBehavior,
}: UseCalendarShellOptions) {
  const baseYear = React.useMemo(() => new Date().getFullYear(), []);

  const [displayMonthRaw, setDisplayMonthRaw] = useControllableState<Date | undefined>({
    value: month,
    defaultValue: startOfMonth(initialMonth),
    onChange: onMonthChange,
  });
  const displayMonth = startOfMonth(displayMonthRaw ?? initialMonth);
  const setDisplayMonth = React.useCallback(
    (next: Date) => setDisplayMonthRaw(startOfMonth(next)),
    [setDisplayMonthRaw]
  );

  // Wheel callbacks can fire rapidly; keep a ref to avoid stale month/year closures.
  const displayMonthRef = React.useRef(displayMonth);
  React.useEffect(() => {
    displayMonthRef.current = displayMonth;
  }, [displayMonth]);

  const locale = React.useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    } catch {
      return undefined;
    }
  }, []);

  const firstDayOfWeekIndex = React.useMemo(() => {
    return firstDayOfWeek
      ? firstDayOfWeekToIndex(firstDayOfWeek)
      : getLocaleFirstDayOfWeekIndex(locale);
  }, [firstDayOfWeek, locale]);

  const safeVisibleMonths = React.useMemo(() => {
    const vm = visibleMonths ?? 1;
    return Math.max(1, Math.min(3, vm));
  }, [visibleMonths]);

  const pageStep = React.useMemo(() => {
    return pageBehavior === 'single' ? 1 : safeVisibleMonths;
  }, [pageBehavior, safeVisibleMonths]);

  const monthsToRender = React.useMemo(() => {
    return Array.from({ length: safeVisibleMonths }, (_, idx) => addMonths(displayMonth, idx));
  }, [displayMonth, safeVisibleMonths]);

  const yearBounds = React.useMemo(() => {
    const from = fromYear ?? baseYear - 100;
    const to = toYear ?? baseYear + 100;
    return clampYearRange(from, to);
  }, [baseYear, fromYear, toYear]);

  const years = React.useMemo(() => {
    const items: Array<Item<number>> = [];
    for (let y = yearBounds.from; y <= yearBounds.to; y++) {
      items.push({ label: String(y), value: y });
    }
    return items;
  }, [yearBounds.from, yearBounds.to]);

  const months = React.useMemo(
    () => MONTHS.map((m, idx) => ({ label: m, value: idx } as Item<number>)),
    []
  );

  const canGoPrev = React.useMemo(() => {
    const prevStart = addMonths(displayMonth, -pageStep);
    return prevStart.getFullYear() >= yearBounds.from;
  }, [displayMonth, pageStep, yearBounds.from]);

  const canGoNext = React.useMemo(() => {
    const lastAfterStep = addMonths(displayMonth, pageStep + safeVisibleMonths - 1);
    return lastAfterStep.getFullYear() <= yearBounds.to;
  }, [displayMonth, pageStep, safeVisibleMonths, yearBounds.to]);

  const [pickerOpen, setPickerOpen] = React.useState(false);

  const onMonthWheel = React.useCallback(
    (monthIndex: number) => {
      const safeMonthIndex = Math.max(0, Math.min(11, monthIndex));
      const currentYear = displayMonthRef.current.getFullYear();
      setDisplayMonth(new Date(currentYear, safeMonthIndex, 1));
    },
    [setDisplayMonth]
  );

  const onYearWheel = React.useCallback(
    (year: number) => {
      const currentMonthIndex = displayMonthRef.current.getMonth();
      setDisplayMonth(new Date(year, currentMonthIndex, 1));
    },
    [setDisplayMonth]
  );

  return {
    displayMonth,
    setDisplayMonth,
    displayMonthRef,
    locale,
    firstDayOfWeekIndex,
    safeVisibleMonths,
    pageStep,
    monthsToRender,
    yearBounds,
    years,
    months,
    canGoPrev,
    canGoNext,
    pickerOpen,
    setPickerOpen,
    onMonthWheel,
    onYearWheel,
  };
}
