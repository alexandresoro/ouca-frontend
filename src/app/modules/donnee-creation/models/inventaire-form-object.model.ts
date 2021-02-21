import { Departement, Inventaire } from "@ou-ca/ouca-model";
import { UICommune } from "src/app/models/commune.model";

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: UICommune;
}
