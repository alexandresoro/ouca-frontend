import { Component } from "@angular/core";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EstimationNombre } from "../../../model/estimation-nombre.object";
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

  getNewObject(): EstimationNombre {
    return new EstimationNombre();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    detailsData[2] = new EntiteDetailsData(
      "Non Compté",
      this.currentObject.nonCompte ? "Oui" : "Non"
    );
    detailsData[3] = new EntiteDetailsData(
      "Nombre de données",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
