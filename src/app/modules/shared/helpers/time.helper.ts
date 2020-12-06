import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
export class TimeHelper {
  public static getFormattedTime(timeStr: string): string {
    if (timeStr) {
      let value = timeStr;
      const dateRegExp1 = new RegExp("^[0-9][0-9][0-9][0-9]$");
      if (dateRegExp1.test(value)) {
        value =
          value.charAt(0) +
          value.charAt(1) +
          ":" +
          value.charAt(2) +
          value.charAt(3);
      }

      const dateRegExp2 = new RegExp("^[0-9][0-9][h][0-9][0-9]$");
      if (dateRegExp2.test(value)) {
        value = value.replace("h", ":");
      }

      const dateRegExp3 = new RegExp("^[0-9][0-9][H][0-9][0-9]$");
      if (dateRegExp3.test(value)) {
        value = value.replace("H", ":");
      }
      return value;
    }
    return null;
  }

  public static isATime = (timeStr: string): boolean => {
    const value = TimeHelper.getFormattedTime(timeStr);

    const timeRegExp = new RegExp("^[0-9][0-9][:][0-9][0-9]$");
    return value && timeRegExp.test(value);
  };
}

/**
 * When the backend returns a date, it is always a timestamp string that is independant ofe the time zone.
 * For example, it will return 2020-02-25 to represent a date that is the 25th of February 2020
 * regardless of where you are in the world.
 * However, in a browser, such date will be interpreted as being 2020-02-25 at 00:00:00 UTC time.
 * It means that such date will appear for example as 2020-02-25 at 01:00:00 CET time,
 * if the browser is set up in a computer as CET.
 * It also means that such date will appear for example as 2020-02-24 at 16:00:00 PST time,
 * if the browser is set up in a computer as PST.
 * As in this app, the date represents timestamps regardless of the timezone, we need to offset the browser time zone,
 * so that a date will always show up as 2020-02-25 00:00:00 regardless of the browser time zone.
 * Effectively, in such case, the output will represent a date that corresponds to
 * Tue Feb 25 2020 00:00:00 GMT+0100 (CET) if the browser is in CET, or
 * Tue Feb 25 2020 00:00:00 GMT-0800 (PST) if the browser is in PST.
 * This offset needs to be reverted when the dates are sent back to the backend, which is done thanks to the opposite method
 */
export const interpretDateTimestampAsBrowserDate = (
  dateString: string
): Date => {
  if (!dateString) {
    return null;
  }
  return utcToZonedTime(new Date(dateString), "UTC");
};

/**
 * When working with dates in the browser, all dates are interpreted as in the browser timezone.
 * When for example, we send a date to the backend, we need to send the date as UTC so that it does not interpret incorrectly the date
 *
 * e.g. if the input is "2019-10-05T22:00:00.000Z" which is equivalent to Sun Oct 06 2019 00:00:00 GMT+0200 (heure d’été d’Europe centrale),
 * this method will return "2019-10-06T00:00:00Z"
 */
export const interpretBrowserDateAsTimestampDate = (
  browserDate: Date
): Date => {
  if (!browserDate) {
    return null;
  }
  return zonedTimeToUtc(browserDate, "UTC");
};
