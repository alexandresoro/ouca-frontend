import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Age } from "@ou-ca/ouca-model/age.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgeEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Age>
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
    return "age";
  };

  public getEntities$(): Observable<Age[]> {
    return this.entitiesStoreService.getAges$();
  }

  public getPageTitle = (): string => {
    return "Âges";
  };

  public getCreationTitle = (): string => {
    return "Création d'un âge";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un âge";
  };
}
