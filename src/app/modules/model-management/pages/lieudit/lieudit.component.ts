import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import * as diacritics from "diacritics";
import * as _ from "lodash";
import { FormValidatorHelper } from "../../../shared/helpers/form-validator.helper";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { LieuditFormComponent } from "../../components/form/lieudit-form/lieudit-form.component";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.tpl.html"
})
export class LieuditComponent extends EntiteSimpleComponent<Lieudit> {
  public ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup(
      {
        id: new FormControl("", []),
        commune: new FormControl("", []),
        nom: new FormControl("", [Validators.required]),
        altitude: new FormControl("", [Validators.required]),
        longitude: new FormControl("", [Validators.required]),
        latitude: new FormControl("", [Validators.required])
      },
      [this.nomValidator]
    );
  }

  public nomValidator: ValidatorFn = (
    formGroup: FormGroup
  ): ValidationErrors | null => {
    const nom = formGroup.controls.nom.value;
    const commune = formGroup.controls.commune.value;
    const id = formGroup.controls.id.value;

    const foundEntityByCode: Lieudit = _.find(this.objects, (object: any) => {
      return (
        diacritics.remove(object.nom.trim().toLowerCase()) ===
          diacritics.remove(nom.trim().toLowerCase()) &&
        object.commune.id === commune.id
      );
    });

    const valueIsAnExistingEntity: boolean =
      !!foundEntityByCode && id !== foundEntityByCode.id;

    return valueIsAnExistingEntity
      ? FormValidatorHelper.getValidatorResult(
          "alreadyExistingNom",
          "Il existe déjà " +
            this.getAnEntityLabel() +
            " avec ce nom dans cette commune."
        )
      : null;
  }

  getEntityName(): string {
    return "lieudit";
  }

  public getAnEntityLabel(): string {
    return "un lieu-dit";
  }

  public getTheEntityLabel(uppercase?: boolean): string {
    return !!uppercase ? "Le lieu-dit" : "le lieu-dit";
  }

  getNewObject(): Lieudit {
    return {
      id: null,
      communeId: null,
      commune: {
        id: null,
        departementId: null,
        code: "",
        nom: ""
      },
      nom: "",
      altitude: 0,
      longitude: 0,
      latitude: 0,
      nbDonnees: 0
    };
  }

  public getFormType(): any {
    return LieuditFormComponent;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Département",
      this.currentObject.commune.departement.code
    );
    detailsData[2] = new EntityDetailsData(
      "Code de la Commune",
      this.currentObject.commune.code
    );
    detailsData[3] = new EntityDetailsData(
      "Nom de la Commune",
      this.currentObject.commune.nom
    );
    detailsData[4] = new EntityDetailsData(
      "Nom du Lieu-dit",
      this.currentObject.nom
    );
    detailsData[5] = new EntityDetailsData(
      "Altitude",
      this.currentObject.altitude
    );
    detailsData[6] = new EntityDetailsData(
      "Longitude",
      this.currentObject.longitude
    );
    detailsData[7] = new EntityDetailsData(
      "Latitude",
      this.currentObject.latitude
    );
    detailsData[8] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
