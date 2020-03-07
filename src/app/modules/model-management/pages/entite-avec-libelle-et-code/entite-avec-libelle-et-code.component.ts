import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EntiteAvecLibelleEtCode } from "ouca-common/entite-avec-libelle-et-code.object";
import { EntiteAvecLibelleEtCodeFormComponent } from "../../components/form/entite-avec-libelle-et-code-form/entite-avec-libelle-et-code-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleEtCodeComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleComponent<T> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        code: new FormControl("", [Validators.required]),
        libelle: new FormControl("", [Validators.required])
      },
      [this.libelleValidator, this.codeValidator]
    );
  }

  public getFormType(): any {
    return EntiteAvecLibelleEtCodeFormComponent;
  }
}
