import { Component } from "@angular/core";
import { Commune } from "../../../model/commune.object";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./commune.tpl.html"
})
export class CommuneComponent extends EntiteSimpleComponent<Commune> {
  getEntityName(): string {
    return "commune";
  }

  getNewObject(): Commune {
    return new Commune();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Département",
      this.currentObject.departement.code
    );
    detailsData[2] = new EntiteDetailsData(
      "Code de la Commune",
      this.currentObject.code
    );
    detailsData[3] = new EntiteDetailsData(
      "Nom de la Commune",
      this.currentObject.nom
    );
    detailsData[3] = new EntiteDetailsData(
      "Nombre de lieux-dits",
      this.currentObject.nbLieuxdits
    );
    detailsData[3] = new EntiteDetailsData(
      "Nombre de données",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
