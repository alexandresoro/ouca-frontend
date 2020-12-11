import { CoordinatesSystemType } from "@ou-ca/ouca-model/coordinates-system";
import { Departement } from "@ou-ca/ouca-model/departement.object";
import { Meteo } from "@ou-ca/ouca-model/meteo.object";
import { Observateur } from "@ou-ca/ouca-model/observateur.object";

export interface DefaultInventaireOptions {
  observateur: Observateur;
  observateursAssocies: Observateur[];
  date: Date;
  lieu: {
    departement: Departement;
    coordinatesSystem: CoordinatesSystemType;
  };
  meteos: Meteo[];
}
