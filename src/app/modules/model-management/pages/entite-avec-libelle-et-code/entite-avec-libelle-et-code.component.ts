import { Component } from "@angular/core";
import { EntiteAvecLibelleEtCode } from "../../../../model/entite-avec-libelle-et-code.object";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  template: ""
})
export class EntiteAvecLibelleEtCodeComponent<
  T extends EntiteAvecLibelleEtCode
> extends EntiteSimpleComponent<T> {
  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData("Code", this.currentObject.code);
    detailsData[2] = new EntityDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    /*
    detailsData[3] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    */
    return detailsData;
  }
}
