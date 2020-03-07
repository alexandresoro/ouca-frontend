import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EstimationNombre } from "ouca-common/estimation-nombre.object";
import { EstimationNombreFormComponent } from "../../components/form/estimation-nombre-form/estimation-nombre-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-nombre.tpl.html"
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
  EstimationNombre
> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        libelle: new FormControl("", [Validators.required]),
        nonCompte: new FormControl("")
      },
      [this.libelleValidator]
    );
  }

  public getFormType(): any {
    return EstimationNombreFormComponent;
  }

  getEntityName(): string {
    return "estimation-nombre";
  }

  public getAnEntityLabel(): string {
    return "une estimation du nombre";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return uppercase ? "L'estimation du nombre" : "l'estimation du nombre";
  }
}
