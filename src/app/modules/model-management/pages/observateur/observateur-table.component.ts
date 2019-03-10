import { Component } from "@angular/core";
import { Observateur } from "../../../../model/observateur.object";
import { EntiteAvecLibelleTableComponent } from "../entite-avec-libelle/entite-avec-libelle-table.component";

@Component({
  selector: "observateur-table",
  templateUrl: "./../entite-avec-libelle/entite-avec-libelle-table.tpl.html"
})
export class ObservateurTableComponent extends EntiteAvecLibelleTableComponent<
  Observateur
> {}
