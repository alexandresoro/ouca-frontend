import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Meteo } from "src/app/model/graphql";
import { BackendApiService } from "src/app/services/backend-api.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type MeteosQueryResult = {
  meteos: Meteo[]
}

const METEOS_QUERY = gql`
  query {
    meteos {
      id
      libelle
    }
  }
`;

@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeteoEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<Meteo>
  implements OnInit {

  private meteos$: Observable<Meteo[]>;

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
    this.meteos$ = this.apollo.watchQuery<MeteosQueryResult>({
      query: METEOS_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.meteos;
      })
    );
    this.initialize();
  }

  public getEntityName = (): string => {
    return "meteo";
  };

  public getEntities$(): Observable<Meteo[]> {
    return this.meteos$;
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
