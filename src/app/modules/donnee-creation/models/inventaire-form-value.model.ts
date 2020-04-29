import { Departement } from "ouca-common/departement.object";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";
import { UICommune } from "src/app/models/commune.model";
import { UILieudit } from "src/app/models/lieudit.model";

export interface InventaireFormValue {
  id: number;
  observateur: Observateur;
  observateursAssocies: Observateur[];
  date: Date;
  heure: string;
  duree: string;
  lieu: {
    departement: Departement;
    commune: UICommune;
    lieudit: UILieudit;
    altitude?: number;
    longitude?: number;
    latitude?: number;
  };
  temperature: number;
  meteos: Meteo[];
}
