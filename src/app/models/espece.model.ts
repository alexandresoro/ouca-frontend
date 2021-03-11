import { Classe } from '../model/types/classe.object';
import { EspeceCommon } from '../model/types/espece-common.model';

export interface UIEspece extends EspeceCommon {
  classe: Classe;
}
