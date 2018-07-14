import { Component } from "@angular/core";
import { EntiteAvecLibelle } from "../../../model/entite-avec-libelle.object";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleComponent<
  T extends EntiteAvecLibelle
> extends EntiteSimpleComponent<T> {
  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    return detailsData;
  }
}
