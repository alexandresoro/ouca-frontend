export enum PageStatus {
  ERROR,
  SUCCESS
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

  public static setErrorStatus(message: string, error?: any) {
    this.setPageStatus(
      PageStatus.ERROR,
      message + (!!error ? "Détails de l'erreur: " + JSON.stringify(error) : "")
    );
    console.error(message, JSON.stringify(error));
  }

  public static resetPageStatus() {
    this.status = null;
    this.message = "";
  }
}
