import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Departement } from "basenaturaliste-model/departement.object";
import { BackendApiService } from "../../../../shared/services/backend-api.service";
import { EntitySubFormComponent } from "../entite-simple-form/entity-sub-form.component";

@Component({
  selector: "commune-form",
  templateUrl: "./commune-form.tpl.html"
})
export class CommuneFormComponent extends EntitySubFormComponent {
  public departements: Departement[];

  constructor(private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit() {
    // Get all departements
    this.backendApiService.getAllEntities("departement").subscribe(
      (result: Departement[]) => {
        this.departements = result;
      },
      (error: HttpErrorResponse) => {
        console.error("Impossible de trouver les départements (" + error + ")");
      }
    );
  }
}
