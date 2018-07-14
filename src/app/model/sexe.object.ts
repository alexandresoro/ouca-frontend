import { EntiteAvecLibelle } from "./entite-avec-libelle.object";

export class Sexe extends EntiteAvecLibelle {
  public libelle: string;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
