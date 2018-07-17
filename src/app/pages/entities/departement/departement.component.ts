import { Component } from "@angular/core";
import { Departement } from "../../../model/departement.object";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./departement.tpl.html"
})
export class DepartementComponent extends EntiteSimpleComponent<Departement> {
  getEntityName(): string {
    return "departement";
  }

  getNewObject(): Departement {
    return new Departement();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData("Code", this.currentObject.code);

    detailsData[2] = new EntiteDetailsData(
      "Nombre de communes",
      this.currentObject.nbCommunes
    );

    detailsData[3] = new EntiteDetailsData(
      "Nombre de lieux-dits",
      this.currentObject.nbLieuxdits
    );

    detailsData[4] = new EntiteDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
