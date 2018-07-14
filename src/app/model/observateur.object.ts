import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class Observateur extends EntiteAvecLibelle {
  public libelle: string;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
