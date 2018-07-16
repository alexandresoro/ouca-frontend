import { Component } from "@angular/core";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
import { EntiteAvecLibelleFormComponent } from "../entite-avec-libelle/entite-avec-libelle-form.component";

@Component({
  selector: "estimation-nombre-form",
  templateUrl: "./estimation-nombre-form.tpl.html"
})
export class EstimationNombreFormComponent extends EntiteAvecLibelleFormComponent<
EstimationNombre
> {
  getNewObject(): EstimationNombre {
    return new EstimationNombre();
  }
}
