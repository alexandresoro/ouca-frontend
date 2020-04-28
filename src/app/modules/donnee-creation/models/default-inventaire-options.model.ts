import { CoordinatesSystemType } from "ouca-common/coordinates-system";
import { Departement } from "ouca-common/departement.object";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";

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
