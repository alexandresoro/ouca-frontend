import { Injectable } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { addDays, addMonths, addYears, format, getDate, getDaysInMonth, getMonth, getYear, parse, setDay, setMonth, toDate } from "date-fns";
// CONFIG. Use environment or something for a dynamic locale and settings
import { fr as locale } from "date-fns/locale";
import { interpretBrowserDateAsTimestampDate } from '../modules/shared/helpers/time.helper';

const WEEK_STARTS_ON = 1; // 0 sunday, 1 monday...

export const MAT_DATE_FNS_DATE_FORMATS = {
  parse: {
    dateInput: ["dd/MM", "dd/MM/yy", "dd/MM/yyyy"]
  },
  display: {
    dateInput: "dd/MM/yyyy",
    monthYearLabel: "LLL y",
    dateA11yLabel: "MMMM d, y",
    monthYearA11yLabel: "MMMM y"
  }
};

// in app.module.ts:
/*
{
  provide: DateAdapter,
  useClass: DateFnsDateAdapter
},
{
  provide: MAT_DATE_FORMATS,
  useValue: MAT_DATE_FNS_DATE_FORMATS
},
 */

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
}

@Injectable()
export class DateFnsDateAdapter extends DateAdapter<Date> {
  addCalendarDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  addCalendarMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }

  addCalendarYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  clone(date: Date): Date {
    return toDate(date);
  }

  createDate(year: number, month: number, date: number): Date {
    return new Date(year, month, date);
  }

  format(date: Date, displayFormat: string): string {
    return format(date, displayFormat, {
      locale
    });
  }

  getDate(date: Date): number {
    return getDate(date);
  }

  getDateNames(): string[] {
    return range(1, 31).map((day) => String(day));
  }

  getDayOfWeek(date: Date): number {
    return parseInt(format(date, "i"), 10);
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    const map = {
      long: "EEEE",
      short: "E..EEE",
      narrow: "EEEEE"
    };

    const formatStr = map[style];
    const date = new Date();

    return range(0, 6).map((month) =>
      format(setDay(date, month), formatStr, {
        locale
      })
    );
  }

  getFirstDayOfWeek(): number {
    return WEEK_STARTS_ON;
  }

  getMonth(date: Date): number {
    return getMonth(date);
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    const map = {
      long: "LLLL",
      short: "LLL",
      narrow: "LLLLL"
    };

    const formatStr = map[style];
    const date = new Date();

    return range(0, 11).map((month) =>
      format(setMonth(date, month), formatStr, {
        locale
      })
    );
  }

  getNumDaysInMonth(date: Date): number {
    return getDaysInMonth(date);
  }

  getYear(date: Date): number {
    return getYear(date);
  }

  getYearName(date: Date): string {
    return format(date, "yyyy", {
      locale
    });
  }

  invalid(): Date {
    return new Date(NaN);
  }

  isDateInstance(obj: unknown): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  parse(value: string, parseFormat: string[]): Date | null {
    for (const format of parseFormat) {
      const parsedDate = parse(value, format, new Date(), {
        locale
      });
      // Invalid date is represented by NaN which is not === to itself
      if (parsedDate.getTime() === parsedDate.getTime()) {
        return parsedDate;
      }
    }
    return null;
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  today(): Date {
    return new Date();
  }
}

export const isADate = (value: string): boolean => {
  const dateFormat = "dd/MM/yyyy";

  const parsedDate = parse(value, dateFormat, new Date(), {
    locale
  });
  // Invalid date is represented by NaN which is not === to itself
  if (parsedDate.getTime() === parsedDate.getTime()) {
    return true;
  }

  return false;
};


export const getDateFromString = (value: string): Date | null => {
  const dateFormat = "dd/MM/yyyy";

  const parsedDate = parse(value, dateFormat, new Date(), {
    locale
  });

  // Invalid date is represented by NaN which is not === to itself
  if (parsedDate.getTime() === parsedDate.getTime()) {
    return interpretBrowserDateAsTimestampDate(parsedDate);
  }

  return null;
};

export const getFormattedDateStringFromString = (value: string): string | null => {
  const dateFormat = "dd/MM/yyyy";

  const parsedDate = parse(value, dateFormat, new Date(), {
    locale
  });

  // Invalid date is represented by NaN which is not === to itself
  if (parsedDate.getTime() === parsedDate.getTime()) {
    return format(parsedDate, 'yyyy-MM-dd');
  }

  return null;
};
