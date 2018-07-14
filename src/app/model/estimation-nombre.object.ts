import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class EstimationNombre extends EntiteAvecLibelle {
  public nonCompte: boolean;

  public nbDonnees: number;

  constructor() {
    super();
    this.nonCompte = false;
  }
}
