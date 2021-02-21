import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observateur, Sexe } from "@ou-ca/ouca-model";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Sexe>
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
    return "sexe";
  };

  public getEntities$(): Observable<Observateur[]> {
    return this.entitiesStoreService.getSexes$();
  }

  public getPageTitle = (): string => {
    return "Sexes";
  };

  public getCreationTitle = (): string => {
    return "Création d'un sexe";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un sexe";
  };
}
