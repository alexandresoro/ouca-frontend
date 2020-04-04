import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Classe } from "ouca-common/classe.object";
import { Espece } from "ouca-common/espece.object";
import { CrossFieldErrorMatcher } from "src/app/modules/shared/matchers/cross-field-error.matcher";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "espece-form",
  templateUrl: "./espece-form.tpl.html"
})
export class EspeceFormComponent extends EntitySubFormComponent<Espece> {
  public classes: Classe[];

  public especeCodeErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingCode"
  );

  public especeNomFrancaisErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNomFrancais"
  );

  public especeNomLatinErrorStateMatcher = new CrossFieldErrorMatcher(
    "alreadyExistingNomLatin"
  );

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    // Get all communes
    this.backendApiService.getAllEntities("classe").subscribe(
      (result: Classe[]) => {
        this.classes = result;
      },
      (error: HttpErrorResponse) => {
        console.error("Impossible de trouver les classes (" + error + ")");
      }
    );
  }
}
