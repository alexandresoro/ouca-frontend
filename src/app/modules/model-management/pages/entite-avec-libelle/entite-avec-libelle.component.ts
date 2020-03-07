import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EntiteAvecLibelle } from "ouca-common/entite-avec-libelle.object";
import { EntiteAvecLibelleFormComponent } from "../../components/form/entite-avec-libelle-form/entite-avec-libelle-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleComponent<T> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        libelle: new FormControl("", [Validators.required])
      },
      [this.libelleValidator]
    );
  }

  public getFormType(): any {
    return EntiteAvecLibelleFormComponent;
  }
}
