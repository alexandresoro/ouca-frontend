import { Classe } from "@ou-ca/ouca-model/classe.object";
import { Donnee } from "@ou-ca/ouca-model/donnee.object";
import { InventaireFormObject } from "./inventaire-form-object.model";

export interface DonneeFormObject extends Donnee {
  isDonneeEmpty?: boolean;
  classe: Classe;
  inventaire: InventaireFormObject;
}
