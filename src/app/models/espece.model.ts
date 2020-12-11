import { Classe } from "@ou-ca/ouca-model/classe.object";
import { EspeceCommon } from "@ou-ca/ouca-model/espece-common.model";

export interface UIEspece extends EspeceCommon {
  classe: Classe;
}
