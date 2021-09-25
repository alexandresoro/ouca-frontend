import { CoordinatesSystemType, Departement, Meteo, Observateur } from "src/app/model/graphql";

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
