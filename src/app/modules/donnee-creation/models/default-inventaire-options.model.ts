import { CoordinatesSystemType, Departement, Meteo, Observateur } from "@ou-ca/ouca-model";

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
