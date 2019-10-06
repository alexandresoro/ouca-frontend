import moment from "moment";

export class TimeHelper {
  public static getFormattedTime(timeStr: string): string {
    if (timeStr) {
      let value = timeStr;
      const dateRegExp1: RegExp = new RegExp("^[0-9][0-9][0-9][0-9]$");
      if (dateRegExp1.test(value)) {
        value =
          value.charAt(0) +
          value.charAt(1) +
          ":" +
          value.charAt(2) +
          value.charAt(3);
      }

      const dateRegExp2: RegExp = new RegExp("^[0-9][0-9][h][0-9][0-9]$");
      if (dateRegExp2.test(value)) {
        value = value.replace("h", ":");
      }

      const dateRegExp3: RegExp = new RegExp("^[0-9][0-9][H][0-9][0-9]$");
      if (dateRegExp3.test(value)) {
        value = value.replace("H", ":");
      }
      return value;
    }
    return null;
  }
}

/**
 * When working with dates in the browser, all dates are interpreted as in the browser timezone.
 * When for example, we send a date to the backend, we need to send the date as UTC so that it does not interpret incorrectly the date
 * 
 * e.g. if the input is "2019-10-05T22:00:00.000Z" which is equivalent to Sun Oct 06 2019 00:00:00 GMT+0200 (heure d’été d’Europe centrale),
 * this method will return "2019-10-06T00:00:00Z"
 */
export const interpretDateAsUTCDate = (date: string): string => {

  if (!date) {
    return null;
  }

  return moment.utc(moment(date).format("YYYY-MM-DD HH:mm")).format();
}