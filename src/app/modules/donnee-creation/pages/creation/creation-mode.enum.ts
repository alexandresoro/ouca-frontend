import { Injectable } from "@angular/core";

export enum CreationModeEnum {
  NEW_INVENTAIRE,
  NEW_DONNEE,
  UPDATE
}

@Injectable()
export class CreationModeHelper {
  public isInventaireMode(mode: CreationModeEnum): boolean {
    return CreationModeEnum.NEW_INVENTAIRE === mode;
  }

  public isDonneeMode(mode: CreationModeEnum): boolean {
    return CreationModeEnum.NEW_DONNEE === mode;
  }

  public isUpdateMode(mode: CreationModeEnum): boolean {
    return CreationModeEnum.UPDATE === mode;
  }
}
