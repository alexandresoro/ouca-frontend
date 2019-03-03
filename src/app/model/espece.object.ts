import { Classe } from "./classe.object";
import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class Espece extends EntiteAvecLibelle {
  public classe: Classe;

  public classeId: number;

  public code: string;

  public nomFrancais: string;

  public nomLatin: string;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
