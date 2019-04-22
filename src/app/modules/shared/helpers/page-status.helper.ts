export enum PageStatus {
  ERROR,
  INFO,
  SUCCESS,
  WARNING
}
export class PageStatusHelper {
  private static message: string;
  private static status: PageStatus;

  public static getStatus(): PageStatus {
    return this.status;
  }

  public static getMessage(): string {
    return this.message;
  }

  private static setPageStatus(status: PageStatus, message: string) {
    this.status = status;
    this.message = !!message ? message : "";
  }

  public static setSuccessStatus(message: string) {
    this.setPageStatus(PageStatus.SUCCESS, message);
    console.log(message);
  }

  public static setInfoStatus(message: string, object?: any) {
    this.setPageStatus(PageStatus.INFO, message);
    console.info(message, !!object ? JSON.stringify(object) : null);
  }

  public static setErrorStatus(message: string, error?: any) {
    this.setPageStatus(
      PageStatus.ERROR,
      message + (!!error ? "Détails de l'erreur: " + JSON.stringify(error) : "")
    );
    console.error(message, JSON.stringify(error));
  }

  public static setWarningStatus(message: string, error?: any) {
    this.setPageStatus(
      PageStatus.WARNING,
      message + (!!error ? "Détails de l'erreur: " + JSON.stringify(error) : "")
    );
    console.warn(message, JSON.stringify(error));
  }

  public static resetPageStatus() {
    this.status = null;
    this.message = "";
  }
}
