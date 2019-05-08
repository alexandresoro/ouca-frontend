import { Component } from "@angular/core";
import { EstimationNombre } from "basenaturaliste-model/estimation-nombre.object";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./estimation-nombre.tpl.html"
})
export class EstimationNombreComponent extends EntiteSimpleComponent<
  EstimationNombre
> {
  getEntityName(): string {
    return "estimation-nombre";
  }

  public getAnEntityLabel(): string {
    return "une estimation du nombre";
  }

  getNewObject(): EstimationNombre {
    return {} as EstimationNombre;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    detailsData[2] = new EntityDetailsData(
      "Non Compté",
      this.currentObject.nonCompte ? "Oui" : "Non"
    );
    detailsData[3] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
