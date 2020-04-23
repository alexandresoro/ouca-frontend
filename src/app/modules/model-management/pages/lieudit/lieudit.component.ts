import { Component, OnInit } from "@angular/core";
import { LieuditCommon } from "ouca-common/lieudit-common.model";
import { Lieudit } from "ouca-common/lieudit.model";
import { Observable } from "rxjs";
import { UILieudit } from "src/app/models/lieudit.model";
import { EntiteSimpleComponent } from "../entite-simple/entite-simple.component";

@Component({
  templateUrl: "./lieudit.component.html"
})
export class LieuditComponent extends EntiteSimpleComponent<LieuditCommon>
  implements OnInit {
  public getEntities$ = (): Observable<UILieudit[]> => {
    return this.entitiesStoreService.getLieuxdits$();
  };

  getEntityName(): string {
    return "lieudit";
  }

  public getDeleteMessage(lieuDit: Lieudit): string {
    return (
      "Êtes-vous certain de vouloir supprimer le lieu-dit " +
      lieuDit.nom +
      " ? " +
      "Toutes les données (" +
      lieuDit.nbDonnees +
      ") avec ce lieu-dit seront supprimées."
    );
  }
}
