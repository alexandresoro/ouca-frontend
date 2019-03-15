import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Response } from "@angular/http";
import { Commune } from "../../../../../model/commune.object";
import { Departement } from "../../../../../model/departement.object";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { GestionModeHelper } from "../../../pages/gestion-mode.enum";
import { EntiteSimpleFormComponent } from "../entite-simple-form/entite-simple-form.component";

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html"
})
export class CommuneFormComponent extends EntiteSimpleFormComponent<Commune> {
  public departements: Departement[];

  public codeFormControl = new FormControl("", [Validators.required]);
  public nomFormControl = new FormControl("", [Validators.required]);

  constructor(
    private backendApiService: BackendApiService,
    modeHelper: GestionModeHelper
  ) {
    super(modeHelper);
  }

  ngOnInit() {
    // Get all departements
    this.backendApiService.getAllEntities("departement").subscribe(
      (result: Departement[]) => {
        this.departements = result;
      },
      (error: Response) => {
        console.error("Impossible de trouver les départements (" + error + ")");
      }
    );
  }

  getNewObject(): Commune {
    return new Commune();
  }
}
