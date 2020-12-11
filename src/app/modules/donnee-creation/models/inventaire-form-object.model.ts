import { Departement } from "@ou-ca/ouca-model/departement.object";
import { Inventaire } from "@ou-ca/ouca-model/inventaire.object";
import { UICommune } from "src/app/models/commune.model";

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: UICommune;
}
