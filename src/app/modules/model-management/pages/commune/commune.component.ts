import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Commune } from "basenaturaliste-model/commune.object";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { CommuneFormComponent } from "../../components/form/commune-form/commune-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./commune.tpl.html"
})
export class CommuneComponent extends EntiteSimpleComponent<Commune> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        departement: new FormControl("", [Validators.required]),
        code: new FormControl("", [Validators.required]),
        nom: new FormControl("", [Validators.required]),
        nbDonnees: new FormControl("", [])
      },
      [this.communeValidator]
    );
  }

  private communeValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    return null;
  }

  getEntityName(): string {
    return "commune";
  }

  public getAnEntityLabel(): string {
    return "une commune";
  }

  getNewObject(): Commune {
    return {} as Commune;
  }

  public getFormType(): any {
    return CommuneFormComponent;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Département",
      this.currentObject.departement.code
    );
    detailsData[2] = new EntityDetailsData(
      "Code de la Commune",
      this.currentObject.code
    );
    detailsData[3] = new EntityDetailsData(
      "Nom de la Commune",
      this.currentObject.nom
    );
    detailsData[3] = new EntityDetailsData(
      "Nombre de lieux-dits",
      this.currentObject.nbLieuxdits
    );
    detailsData[4] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );

    return detailsData;
  }
}
