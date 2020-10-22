import { CommuneCommon } from "@ou-ca/ouca-model/commune-common.model";
import { Departement } from "@ou-ca/ouca-model/departement.object";

export interface UICommune extends CommuneCommon {
  departement: Departement;
}
