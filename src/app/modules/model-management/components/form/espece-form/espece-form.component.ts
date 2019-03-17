import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Response } from "@angular/http";
import { Classe } from "basenaturaliste-model/classe.object";
import { Espece } from "basenaturaliste-model/espece.object";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { GestionModeHelper } from "../../../pages/gestion-mode.enum";
import { EntiteSimpleFormComponent } from "../entite-simple-form/entite-simple-form.component";

@Component({
  selector: "espece-form",
  templateUrl: "./espece-form.tpl.html"
})
export class EspeceFormComponent extends EntiteSimpleFormComponent<Espece> {
  public classes: Classe[];

  public codeFormControl = new FormControl("", [Validators.required]);
  public nomFrancaisFormControl = new FormControl("", [Validators.required]);
  public nomLatinFormControl = new FormControl("", [Validators.required]);

  constructor(
    private backendApiService: BackendApiService,
    modeHelper: GestionModeHelper
  ) {
    super(modeHelper);
  }

  ngOnInit(): void {
    // Get all communes
    this.backendApiService.getAllEntities("classe").subscribe(
      (result: Classe[]) => {
        this.classes = result;
      },
      (error: Response) => {
        console.error("Impossible de trouver les classes (" + error + ")");
      }
    );
  }

  getNewObject(): Espece {
    return {} as Espece;
  }
}
