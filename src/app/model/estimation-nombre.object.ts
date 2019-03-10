import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class EstimationNombre extends EntiteAvecLibelle {
  public nonCompte: boolean;
  constructor() {
    super();
    this.nonCompte = false;
  }
}
