import { Component } from "@angular/core";
import { Espece } from "basenaturaliste-model/espece.object";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.tpl.html"
})
export class EspeceComponent extends EntiteSimpleComponent<Espece> {
  getEntityName(): string {
    return "espece";
  }

  getNewObject(): Espece {
    return {} as Espece;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Classe",
      this.currentObject.classe.libelle
    );
    detailsData[2] = new EntityDetailsData("Code", this.currentObject.code);
    detailsData[3] = new EntityDetailsData(
      "Nom français",
      this.currentObject.nomFrancais
    );
    detailsData[4] = new EntityDetailsData(
      "Nom latin",
      this.currentObject.nomLatin
    );
    /*
    detailsData[5] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    */
    return detailsData;
  }
}
