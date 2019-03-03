import { EntiteSimple } from "./entite-simple.object";
import { Lieudit } from "./lieudit.object";
import { Meteo } from "./meteo.object";
import { Observateur } from "./observateur.object";

export class Inventaire extends EntiteSimple {
  public associes: Observateur[];

  public date: Date;

  public duree: string;

  public heure: string;

  public lieudit: Lieudit;

  public altitude: number;

  public longitude: number;

  public latitude: number;

  public meteos: Meteo[] = new Array<Meteo>();

  public observateur: Observateur;

  public temperature: number;

  constructor() {
    super();
  }
}
