import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Milieu } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEtCodeEditAbstractComponent } from "../entite-avec-libelle-et-code/entite-avec-libelle-et-code-edit.component";

type MilieuxQueryResult = {
  milieux: Milieu[]
}

const MILIEUX_QUERY = gql`
  query {
    milieux {
      id
      code
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilieuEditComponent
  extends EntiteAvecLibelleEtCodeEditAbstractComponent<Milieu>
  implements OnInit {

  private milieux$: Observable<Milieu[]>;

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
    this.milieux$ = this.apollo.watchQuery<MilieuxQueryResult>({
      query: MILIEUX_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.milieux;
      })
    );
    this.initialize();
  }

  public getEntityName = (): string => {
    return "milieu";
  };

  public getEntities$(): Observable<Milieu[]> {
    return this.milieux$;
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
