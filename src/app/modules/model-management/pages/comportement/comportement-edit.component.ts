import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Comportement } from "ouca-common/comportement.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEtCodeEditAbstractComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html"
})
export class ComportementEditComponent
  extends EntiteAvecLibelleEtCodeEditAbstractComponent<Comportement>
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
    return "comportement";
  };

  public getEntities$(): Observable<Comportement[]> {
    return this.entitiesStoreService.getComportements$();
  }

  public updateEntities = (): void => {
    this.entitiesStoreService.updateComportements();
  };

  public getPageTitle = (): string => {
    return "Comportements";
  };

  public getCreationTitle = (): string => {
    return "Création d'un comportement";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un comportement";
  };
}
