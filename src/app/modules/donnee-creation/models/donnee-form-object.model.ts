import { Classe } from 'src/app/model/types/classe.object';
import { Donnee } from 'src/app/model/types/donnee.object';
import { InventaireFormObject } from "./inventaire-form-object.model";

export interface DonneeFormObject extends Donnee {
  isDonneeEmpty?: boolean;
  classe: Classe;
  inventaire: InventaireFormObject;
}
