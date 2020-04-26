import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Milieu } from "ouca-common/milieu.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEtCodeEditAbstractComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuEditComponent
  extends EntiteAvecLibelleEtCodeEditAbstractComponent<Milieu>
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
    return "milieu";
  };

  public getEntities$(): Observable<Milieu[]> {
    return this.entitiesStoreService.getMilieux$();
  }

  public getPageTitle = (): string => {
    return "Milieux";
  };

  public getCreationTitle = (): string => {
    return "Création d'un milieu";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un milieu";
  };
}
