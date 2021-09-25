import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistance } from "src/app/model/graphql";
import { EntitiesStoreService } from "src/app/services/entities-store.service";
import { EntiteAvecLibelleEditAbstractComponent } from "../entite-avec-libelle/entite-avec-libelle-edit.component";

type EstimationsDistanceQueryResult = {
  estimationsDistance: EstimationDistance[]
}

const ESTIMATIONS_DISTANCE_QUERY = gql`
  query {
    estimationsDistance {
      id
      libelle
    }
  }
`;


@Component({
  templateUrl: "../entite-simple/entity-edit.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimationDistanceEditComponent
  extends EntiteAvecLibelleEditAbstractComponent<EstimationDistance>
  implements OnInit {

  private estimationsDistance$: Observable<EstimationDistance[]>;

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
    this.estimationsDistance$ = this.apollo.watchQuery<EstimationsDistanceQueryResult>({
      query: ESTIMATIONS_DISTANCE_QUERY
    }).valueChanges.pipe(
      map(({ data }) => {
        return data?.estimationsDistance;
      })
    );
    this.initialize();
  }

  public getEntityName = (): string => {
    return "estimation-distance";
  };

  public getEntities$(): Observable<EstimationDistance[]> {
    return this.estimationsDistance$;
  }

  public getPageTitle = (): string => {
    return "Estimations de la distance";
  };

  public getCreationTitle = (): string => {
    return "Création d'une estimation de la distance";
  };

  public getEditionTitle = (): string => {
    return "Edition d'une estimation de la distance";
  };
}
