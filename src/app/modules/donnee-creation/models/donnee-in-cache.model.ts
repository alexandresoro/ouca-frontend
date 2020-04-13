import { DonneeFormObject } from "./donnee-form-object.model";

export interface DonneeInCache {
  donnee: DonneeFormObject;
  isInventaireEnabled: boolean;
  isDonneeEnabled: boolean;
}
