import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Meteo } from "@ou-ca/ouca-model/meteo.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Meteo>
  implements OnInit {
  constructor(
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
  }

  ngOnInit(): void {
    this.initialize();
  }

  public getEntityName = (): string => {
    return "meteo";
  };

  public getEntities$(): Observable<Meteo[]> {
    return this.entitiesStoreService.getMeteos$();
  }

  public getPageTitle = (): string => {
    return "Météos";
  };

  public getCreationTitle = (): string => {
    return "Création d'une météo";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une météo";
  };
}
