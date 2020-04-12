import { Commune } from "ouca-common/commune.object";
import { Departement } from "ouca-common/departement.object";
import { Inventaire } from "ouca-common/inventaire.object";

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: Commune;
}
