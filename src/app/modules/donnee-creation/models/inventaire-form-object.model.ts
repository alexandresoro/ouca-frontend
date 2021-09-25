import { Commune, Departement } from 'src/app/model/graphql';
import { Inventaire } from 'src/app/model/types/inventaire.object';

export interface InventaireFormObject extends Inventaire {
  departement: Departement;
  commune: Commune;
}
