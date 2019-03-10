import { Component } from "@angular/core";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { Espece } from "../../../model/espece.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./espece.tpl.html"
})
export class EspeceComponent extends EntiteSimpleComponent<Espece> {
  getEntityName(): string {
    return "espece";
  }

  getNewObject(): Espece {
    return new Espece();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Classe",
      this.currentObject.classe.libelle
    );
    detailsData[2] = new EntiteDetailsData("Code", this.currentObject.code);
    detailsData[3] = new EntiteDetailsData(
      "Nom français",
      this.currentObject.nomFrancais
    );
    detailsData[4] = new EntiteDetailsData(
      "Nom latin",
      this.currentObject.nomLatin
    );
    /*
    detailsData[5] = new EntiteDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    */
    return detailsData;
  }
}
