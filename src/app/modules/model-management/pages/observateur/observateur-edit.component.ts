import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Observateur } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type ObservateursQueryResult = {
  observateurs: Observateur[]
}

const OBSERVATEURS_QUERY = gql`
  query {
    observateurs {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservateurEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Observateur>
  implements OnInit {

  private observateurs$: Observable<Observateur[]>;

  constructor(
    private apollo: Apollo,
    entitiesStoreService: EntitiesStoreService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(entitiesStoreService, router, route, location);
  }

  ngOnInit(): void {
    this.observateurs$ = this.apollo.watchQuery<ObservateursQueryResult>({
      query: OBSERVATEURS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.observateurs;
      })
    );
    this.initialize();
  }

  public getEntityName = (): string => {
    return "observateur";
  };

  public getEntities$(): Observable<Observateur[]> {
    return this.observateurs$;
  }

  public getPageTitle = (): string => {
    return "Observateurs";
  };

  public getCreationTitle = (): string => {
    return "Création d'un observateur";
  };

  public getEditionTitle = (): string => {
    return "Edition d'un observateur";
  };
}
