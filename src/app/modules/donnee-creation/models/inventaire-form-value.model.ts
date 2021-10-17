import { Commune, Departement, LieuDit, Meteo, Observateur } from 'src/app/model/graphql';

export interface InventaireFormValue {
  id: number;
  observateur: Observateur;
  observateursAssocies: Observateur[];
  date: Date;
  heure?: string;
  duree?: string;
  lieu: {
    departement: Departement;
    commune: Partial<Commune>;
    lieudit: Partial<Omit<LieuDit, 'commune'>> & { commune?: Partial<Commune> };
    altitude?: number;
    longitude?: number;
    latitude?: number;
  };
  temperature?: number;
  meteos: Meteo[];
}
