import { CreationModeEnum } from "./creation-mode.enum";

export class CreationModeHelper {
  private static mode: CreationModeEnum;

  public static updateCreationMode(mode: CreationModeEnum): void {
    this.mode = mode;
  }

  public static getCreationMode(): CreationModeEnum {
    return this.mode;
  }

  public static isInventaireMode(): boolean {
    return CreationModeEnum.NEW_INVENTAIRE === this.mode;
  }

  public static isDonneeMode(): boolean {
    return CreationModeEnum.NEW_DONNEE === this.mode;
  }

  public static isUpdateMode(): boolean {
    return CreationModeEnum.UPDATE === this.mode;
  }
}
