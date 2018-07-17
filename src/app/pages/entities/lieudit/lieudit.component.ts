import { Component } from "@angular/core";
import { EntiteDetailsData } from "../../../model/entite-details-data.objects";
import { Lieudit } from "../../../model/lieudit.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.tpl.html"
})
export class LieuditComponent extends EntiteSimpleComponent<Lieudit> {
  getEntityName(): string {
    return "lieudit";
  }

  getNewObject(): Lieudit {
    return new Lieudit();
  }

  public getDetailsData(): EntiteDetailsData[] {
    const detailsData: EntiteDetailsData[] = [];
    detailsData[0] = new EntiteDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntiteDetailsData(
      "Département",
      this.currentObject.commune.departement.code
    );
    detailsData[2] = new EntiteDetailsData(
      "Code de la Commune",
      this.currentObject.commune.code
    );
    detailsData[3] = new EntiteDetailsData(
      "Nom de la Commune",
      this.currentObject.commune.nom
    );
    detailsData[4] = new EntiteDetailsData(
      "Nom du Lieu-dit",
      this.currentObject.nom
    );
    detailsData[5] = new EntiteDetailsData(
      "Altitude",
      this.currentObject.altitude
    );
    detailsData[6] = new EntiteDetailsData(
      "Longitude",
      this.currentObject.longitude
    );
    detailsData[7] = new EntiteDetailsData(
      "Latitude",
      this.currentObject.latitude
    );
    detailsData[8] = new EntiteDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );

    return detailsData;
  }
}
