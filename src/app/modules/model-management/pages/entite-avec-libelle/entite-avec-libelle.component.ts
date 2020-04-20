import { EntiteAvecLibelle } from "ouca-common/entite-avec-libelle.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

export abstract class EntiteAvecLibelleComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleComponent<T> {}
