import { Departement } from "ouca-common/departement.object";
import { Inventaire } from "ouca-common/inventaire.object";
import { UICommune } from "src/app/models/commune.model";

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: UICommune;
}
