import { EntiteSimple } from "./entite-simple.object";

export class Departement extends EntiteSimple {
  public code: string;

  public nbCommunes: number;

  public nbLieuxdits: number;

  public nbDonnees: number;

  constructor() {
    super();
  }
}
