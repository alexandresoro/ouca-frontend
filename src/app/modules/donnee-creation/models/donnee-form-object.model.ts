import { Classe, Donnee } from "@ou-ca/ouca-model";
import { InventaireFormObject } from "./inventaire-form-object.model";

export interface DonneeFormObject extends Donnee {
  isDonneeEmpty?: boolean;
  classe: Classe;
  inventaire: InventaireFormObject;
}
