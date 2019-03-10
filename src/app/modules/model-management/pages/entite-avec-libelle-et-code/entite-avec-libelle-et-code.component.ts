import { Component } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "../../../../model/entite-avec-libelle-et-code.object";
import { EntiteDetailsData } from "../../../../model/entite-details-data.objects";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleEtCodeComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleComponent<T> {
  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData("Code", this.currentObject.code);
    detailsData[2] = new EntiteDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    /*
    detailsData[3] = new EntiteDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    */
    return detailsData;
  }
}
