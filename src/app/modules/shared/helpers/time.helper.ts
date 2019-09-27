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
