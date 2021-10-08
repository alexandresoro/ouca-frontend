import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Sexe } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type SexesQueryResult = {
  sexes: Sexe[]
}

const SEXES_QUERY = gql`
  query {
    sexes {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexeEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Sexe>
  implements OnInit {

  private sexes$: Observable<Sexe[]>;

  constructor(
    private apollo: Apollo,
    backendApiService: BackendApiService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(backendApiService, router, route, location);
  }

  ngOnInit(): void {
    this.sexes$ = this.apollo.watchQuery<SexesQueryResult>({
      query: SEXES_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.sexes;
      })
    );
    this.initialize();
  }

  public getEntityName = (): string => {
    return "sexe";
  };

  public getEntities$(): Observable<Sexe[]> {
    return this.sexes$;
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
