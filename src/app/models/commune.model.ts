import { CommuneCommon } from "ouca-common/commune-common.model";
import { Departement } from "ouca-common/departement.object";

export interface UICommune extends CommuneCommon {
  departement: Departement;
}
