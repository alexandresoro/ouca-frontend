import { Commune } from "ouca-common/commune.object";
import { Departement } from "ouca-common/departement.object";
import { Lieudit } from "ouca-common/lieudit.object";
import { Meteo } from "ouca-common/meteo.object";
import { Observateur } from "ouca-common/observateur.object";

export interface InventaireFormValue {
  id: number | null;
  observateur: Observateur | null;
  observateursAssocies: Observateur[];
  date: Date;
  heure: string | null;
  duree: string | null;
  lieu: {
    departement: Departement | null;
    commune: Commune | null;
    lieudit: Lieudit | null;
    altitude: number | null;
    longitude: number | null;
    latitude: number | null;
  };
  temperature: number | null;
  meteos: Meteo[];
}
