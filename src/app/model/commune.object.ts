import { Departement } from "./departement.object";
import { EntiteSimple } from "./entite-simple.object";

export class Commune extends EntiteSimple {
  public departement: Departement;

  public departementId: number;

  public code: string;

  public nom: string;

  public nbLieuxdits: number;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
