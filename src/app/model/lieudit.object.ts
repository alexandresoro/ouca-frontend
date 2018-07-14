import { Commune } from "./commune.object";
import { EntiteAvecLibelle } from "./entite-avec-libelle.object";
import { EntiteSimple } from "./entite-simple.object";

export class Lieudit extends EntiteSimple {
  readonly ENTITY_NAME = "lieudit";

  public commune: Commune;

  public nom: string;

  public altitude: number;

  public longitude: number;

  public latitude: number;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
