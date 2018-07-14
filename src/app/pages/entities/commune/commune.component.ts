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
    detailsData[0] = new EntiteDetailsData("ID", this.objectToView.id);
    detailsData[1] = new EntiteDetailsData(
      "Département",
      this.objectToView.departement.code
    );
    detailsData[2] = new EntiteDetailsData(
      "Code de la Commune",
      this.objectToView.code
    );
    detailsData[3] = new EntiteDetailsData(
      "Nom de la Commune",
      this.objectToView.nom
    );
    return detailsData;
  }
}
