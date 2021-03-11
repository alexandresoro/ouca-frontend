import { CommuneCommon } from '../model/types/commune-common.model';
import { Departement } from '../model/types/departement.object';

export interface UICommune extends CommuneCommon {
  departement: Departement;
}
