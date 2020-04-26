import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Classe } from "ouca-common/classe.object";
import { Observable } from "rxjs";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasseEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Classe>
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
    return "classe";
  };

  public getEntities$(): Observable<Classe[]> {
    return this.entitiesStoreService.getClasses$();
  }

  public getPageTitle = (): string => {
    return "Classes espèces";
  };

  public getCreationTitle = (): string => {
    return "Création d'une classe espèce";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une classe espèce";
  };
}
