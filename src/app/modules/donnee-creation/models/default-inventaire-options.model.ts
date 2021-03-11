import { CoordinatesSystemType } from 'src/app/model/coordinates-system/coordinates-system.object';
import { Departement } from 'src/app/model/types/departement.object';
import { Meteo } from 'src/app/model/types/meteo.object';
import { Observateur } from 'src/app/model/types/observateur.object';

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
