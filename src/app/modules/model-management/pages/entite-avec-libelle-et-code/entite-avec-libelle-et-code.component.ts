import { EntiteAvecLibelleEtCode } from "ouca-common/entite-avec-libelle-et-code.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

export abstract class EntiteAvecLibelleEtCodeComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleComponent<T> {}
