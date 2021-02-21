import { CommuneCommon, Departement } from "@ou-ca/ouca-model";

export interface UICommune extends CommuneCommon {
  departement: Departement;
}
