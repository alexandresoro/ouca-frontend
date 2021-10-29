import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { EstimationDistance, InputEstimationDistance, MutationUpsertEstimationDistanceArgs } from "src/app/model/graphql";
import { StatusMessageService } from "src/app/services/status-message.service";
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

const ESTIMATION_DISTANCE_UPSERT = gql`
  mutation EstimationDistanceUpsert($id: Int, $data: InputEstimationDistance!) {
    upsertEstimationDistance(id: $id, data: $data) {
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
    private statusMessageService: StatusMessageService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(router, route, location);
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

  public saveEntity = (formValue: InputEstimationDistance & { id: number }): void => {
    const { id, ...rest } = formValue;

    this.apollo.mutate<EstimationDistance, MutationUpsertEstimationDistanceArgs>({
      mutation: ESTIMATION_DISTANCE_UPSERT,
      variables: {
        id,
        data: rest
      }
    }).subscribe(({ data, errors }) => {
      if (data) {
        this.statusMessageService.showSuccessMessage(
          "L'estimation de la distance a été sauvegardée avec succès."
        );
      } else {
        this.statusMessageService.showErrorMessage(
          "Une erreur est survenue pendant la sauvegarde.",
          JSON.stringify(errors)
        );
      }
      data && this.backToEntityPage();
    })
  };


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
