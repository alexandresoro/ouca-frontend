import { Component } from "@angular/core";
import { Classe } from "../../../model/classe.object";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { EntiteAvecLibelleComponent } from "../entite-avec-libelle/entite-avec-libelle.component";

@Component({
  templateUrl: "./classe.tpl.html"
})
export class ClasseComponent extends EntiteAvecLibelleComponent<Classe> {
  public getEntityName(): string {
    return "classe";
  }

  public getNewObject(): Classe {
    return new Classe();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Libellé",
      this.currentObject.libelle
    );
    /*
    detailsData[2] = new EntiteDetailsData(
      "Nombre d'espèces",
      null
      // this.currentObject.nbEspeces
    );
    detailsData[3] = new EntiteDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    */
    return detailsData;
  }
}
