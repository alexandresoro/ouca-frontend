export enum EntityMode {
  VIEW_ALL,
  VIEW_ONE,
  CREATION,
  EDITION,
  REMOVE
}
export class EntityModeHelper {
  private static mode: EntityMode;

  public static isViewAllMode(): boolean {
    return EntityMode.VIEW_ALL === this.mode;
  }

  public static isEditionMode(): boolean {
    return EntityMode.EDITION === this.mode;
  }

  public static isCreationMode(): boolean {
    return EntityMode.CREATION === this.mode;
  }

  public static isViewOneMode(): boolean {
    return EntityMode.VIEW_ONE === this.mode;
  }

  public static isRemoveMode(): boolean {
    return EntityMode.REMOVE === this.mode;
  }

  public static switchToViewAllMode(): void {
    this.mode = EntityMode.VIEW_ALL;
  }

  public static switchToViewOneMode(): void {
    this.mode = EntityMode.VIEW_ONE;
  }

  public static switchToCreationMode(): void {
    this.mode = EntityMode.CREATION;
  }

  public static switchToEditionMode(): void {
    this.mode = EntityMode.EDITION;
  }

  public static switchToRemoveMode(): void {
    this.mode = EntityMode.REMOVE;
  }
}
