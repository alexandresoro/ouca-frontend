import { Classe } from "ouca-common/classe.object";
import { EspeceCommon } from "ouca-common/espece-common.model";

export interface UIEspece extends EspeceCommon {
  classe: Classe;
}
