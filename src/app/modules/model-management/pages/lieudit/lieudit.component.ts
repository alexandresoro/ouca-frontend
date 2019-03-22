import { Component } from "@angular/core";
import { Lieudit } from "basenaturaliste-model/lieudit.object";
import { EntityDetailsData } from "../../components/entity-details/entity-details-data.object";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.tpl.html"
})
export class LieuditComponent extends EntiteSimpleComponent<Lieudit> {
  getEntityName(): string {
    return "lieudit";
  }

  getNewObject(): Lieudit {
    return {} as Lieudit;
  }

  public getDetailsData(): EntityDetailsData[] {
    const detailsData: EntityDetailsData[] = [];
    detailsData[0] = new EntityDetailsData("ID", this.currentObject.id);
    detailsData[1] = new EntityDetailsData(
      "Département",
      this.currentObject.commune.departement.code
    );
    detailsData[2] = new EntityDetailsData(
      "Code de la Commune",
      this.currentObject.commune.code
    );
    detailsData[3] = new EntityDetailsData(
      "Nom de la Commune",
      this.currentObject.commune.nom
    );
    detailsData[4] = new EntityDetailsData(
      "Nom du Lieu-dit",
      this.currentObject.nom
    );
    detailsData[5] = new EntityDetailsData(
      "Altitude",
      this.currentObject.altitude
    );
    detailsData[6] = new EntityDetailsData(
      "Longitude",
      this.currentObject.longitude
    );
    detailsData[7] = new EntityDetailsData(
      "Latitude",
      this.currentObject.latitude
    );
    detailsData[8] = new EntityDetailsData(
      "Nombre de fiches espèces",
      this.currentObject.nbDonnees
    );
    return detailsData;
  }
}
