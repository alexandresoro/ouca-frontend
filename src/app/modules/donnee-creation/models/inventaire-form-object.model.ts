import { Departement } from 'src/app/model/types/departement.object';
import { Inventaire } from 'src/app/model/types/inventaire.object';
import { UICommune } from "src/app/models/commune.model";

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: UICommune;
}
